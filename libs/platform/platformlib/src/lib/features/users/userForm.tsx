import { useState, useEffect } from "react";
import "react-phone-number-input/style.css";
import { useHistory, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { Grid, Typography, Button, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../themes";
import { InputTextWithLabel, Card, SelectSites, Snackbar, UnsavedData, PhoneInput as CustomPhoneNumber  } from "../../components";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { DeactivateUser as ActivateOrDeactiveUser } from "./ActivateOrDeactivateUser";
import {
  selectedUserEmail,
  selectUserByIdEntity,
  updateUser,
  currentApps,
  User,
  addNewUser,
  setUserFormModified,
  getUserFormModified,
  selectOrganizationByDomain
} from '@cloudcore/redux-store';
import { withStyles } from "@mui/styles";

const CustomCss = withStyles(() => ({
  "@global": {
    ".PhoneInputCountry": {
      alignItems: "normal",
      marginTop: "32px",
    },
  },
}))(() => null);

export const UserForm = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const location: any = useLocation();
  const selectedApps = useAppSelector(currentApps);

  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);

  const isAddUser = location.state?.from === "addUser";
  const isEditUser = location.state?.from === "editUser";

  const headerTitle = location.state?.title;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const selectedId: string = useAppSelector(selectedUserEmail);
  const user = useAppSelector(selectUserByIdEntity(selectedId)); //selectUserByIdEntity(selectedId));
  const updatedUserInfo = structuredClone(user);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const org = useAppSelector((state) =>
    selectOrganizationByDomain(state, selectedId)
  );
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState("");
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [phoneLabelColor, setPhoneLabelColor] = useState("#616161");
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);
  const [phoneNumberInValid, setPhoneNumberInValid] = useState(false);
  const [modifiedData, setModifiedData] = useState(false);
  const userFormModified = useAppSelector(getUserFormModified);

  const onFirstNameChanged = (value: string) => {
    value ? setFirstNameInvalid(false) : setFirstNameInvalid(true);
    setFirstName(value);
    // setModifiedData(true);
    dispatch(setUserFormModified(true));
  };

  const onFirstNameFocused = (ele: HTMLInputElement) => {
    ele.value ? setFirstNameInvalid(false) : setFirstNameInvalid(true);
  };

  const onLastNameChanged = (value: string) => {
    value ? setLastNameInvalid(false) : setLastNameInvalid(true);
    setLastName(value);
    // setModifiedData(true);
    dispatch(setUserFormModified(true));
  };
  // replace location state to show the reload and redirect page
  window.history.replaceState({ from: "userForm" }, document.title);

  useEffect(() => {
    if (
      location.state === undefined &&
      location.pathname.includes("editUser")
    ) {
      history.push("/user", { from: "editUser", task: "navigateToUser" });
    } else if (
      location.state === undefined &&
      location.pathname.includes("addUser")
    ) {
      history.push("/user/email", { from: "addUser", task: "navigateToAdd" });
    }
  }, []);

  const onLastNameFocused = (ele: HTMLInputElement) => {
    ele.value ? setLastNameInvalid(false) : setLastNameInvalid(true);
  };
  const onStreetChanged = (value: string) => {
    setStreet(value);
    // setModifiedData(true);
    dispatch(setUserFormModified(true));
  };
  const onCityChanged = (value: string) => {
    setCity(value);
    // setModifiedData(true);
    dispatch(setUserFormModified(true));
  };
  const onZipChanged = (value: string) => {
    setZip(value);
    // setModifiedData(true);
    dispatch(setUserFormModified(true));
  };
  const onPhoneChanged = (value: string) => {
    if (value) {
      const isValid = isPossiblePhoneNumber(value);
      isValid ? setPhoneNumberInValid(false) : setPhoneNumberInValid(true);
    } else {
      setPhoneNumberInValid(false);
    }
    setPhone(value);
    // setModifiedData(true);
    dispatch(setUserFormModified(true));
  };
  const onTitleChanged = (value: string) => {
    setTitle(value);
    // setModifiedData(true);
    dispatch(setUserFormModified(true));
  };
  const onEmailChanged = (value: string) => {
    setEmail(value);
    // setModifiedData(true);
    dispatch(setUserFormModified(true));
  };
  const onInActiveDateChanged = (value: Date | null) => {
    if (updatedUserInfo) {
      updatedUserInfo.inactiveDate = null;
    }
  };

  const handleDialogBox = (open: boolean) => {
    setDialogBoxOpen(open);
  };

  const handleSnackbar = (value: boolean) => {
    setSnackbar(value);
  };

  const handleSnackbarType = (value: string) => {
    setSnackBarType(value);
  };

  const handleSnackbarMsg = (value: string) => {
    setSnackBarMsg(value);
  };

  const updateUserClick = () => {
    try {
      setAddRequestStatus("pending");
      if (updatedUserInfo) {
        updatedUserInfo.firstName = firstName;
        updatedUserInfo.lastName = lastName;
        updatedUserInfo.address.street = street;
        updatedUserInfo.address.city = city;
        updatedUserInfo.address.zip = zip;
        updatedUserInfo.phone = phone;
        updatedUserInfo.title = title;
        updatedUserInfo.email = email;
        updatedUserInfo.applications = selectedApps;
        updatedUserInfo.modifiedDate = new Date();
      }
      if (firstName && lastName && !phoneNumberInValid) {
        dispatch(updateUser(updatedUserInfo!))
          .unwrap()
          .then(
            (value) => {
              setSnackbar(true);
              setSnackBarMsg("editUserSuccess");
              setSnackBarType("success");
              setTimeout(() => {
                history.push("/user");
              }, 1000);
            },
            (reason) => {
              setSnackbar(true);
              setSnackBarMsg("editUserFailure");
              setSnackBarType("failure");
            }
          );
      } else {
        if (firstName === "") {
          setFirstNameInvalid(true);
          document.getElementById("firstName")?.focus();
        }
        if (lastName === "") {
          setLastNameInvalid(true);
          document.getElementById("lastName")?.focus();
        }
        if (phoneNumberInValid) {
          document.getElementById("phoneInput")?.focus();
        }
      }
      // dispatch(selectUserID(""));
    } catch (err) {
      console.error("Failed to save the user", err);
    } finally {
      setAddRequestStatus("idle");
    }
  };

  const saveUserClick = () => {
    try {
      const newUser: User = {
        firstName: firstName,
        lastName: lastName,
        address: {
          street: street,
          city: city,
          zip: zip,
        },
        phone: phone,
        title: title,
        email: email,
        applications: selectedApps,
        id: email,
        orgCode: orgCode,
        inactiveDate: null,
        createdDate: new Date(),
        modifiedDate: new Date(),
      };
      if (firstName && lastName && !phoneNumberInValid) {
        dispatch(addNewUser(newUser))
          .unwrap()
          .then(
            (value) => {
              setSnackbar(true);
              setSnackBarMsg("addUserSuccess");
              setSnackBarType("success");
              setTimeout(() => {
                history.push("/user");
              }, 1000);
            },
            (reason) => {
              setSnackbar(true);
              setSnackBarMsg("addUserFailure");
              setSnackBarType("failure");
            }
          );
      } else {
        if (firstName === "") {
          setFirstNameInvalid(true);
          document.getElementById("firstName")?.focus();
        }
        if (lastName === "") {
          setLastNameInvalid(true);
          document.getElementById("lastName")?.focus();
        }
        if (phoneNumberInValid) {
          document.getElementById("phoneInput")?.focus();
        }
      }
    } catch (err) {
      console.error("Failed to save the user", err);
    } finally {
      setAddRequestStatus("idle");
    }
  };

  const closeEditUser = () => {
    userFormModified
      ? setDialogBoxOpen(true)
      : location.pathname.includes("editUser")
      ? history.push("/user")
      : history.push("/user/email");
  };

  useEffect(() => {
    setEmail(selectedId);
    setOrgCode(org ? org : user?.orgCode ? user?.orgCode : "");
    if (user !== undefined && isEditUser) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setStreet(user.address.street);
      setCity(user.address.city);
      setZip(user.address.zip);
      setPhone(user.phone);
      setTitle(user.title);
      setOrgCode(user.orgCode);
    }
  }, [selectedId, user, isEditUser, isAddUser, org]);

  window.onbeforeunload = function () {
    if (isAddUser || isEditUser) {
      return "Do you want to reload the page?";
    }
    return null;
  };

  const handleValidate = (value: any) => {
    const isValid = isPossiblePhoneNumber(value);
    isValid ? setPhoneNumberInValid(false) : setPhoneNumberInValid(true);
    return isValid;
  };

  return (
    <Grid container spacing={1}>
      <CustomCss />
      {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
      {
        <UnsavedData
          open={dialogBoxOpen}
          handleLeave={handleDialogBox}
          location="users"
        />
      }
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingX: theme.spacing(3),
            paddingY: theme.spacing(1),
          }}
        >
          {isAddUser ? (
            <Typography
              variant="subtitle1"
              fontSize="18px"
              color={theme.breadcrumLink.primary}
            >
              Add New User
            </Typography>
          ) : (
            <Typography
              variant="subtitle1"
              fontSize="18px"
              color={theme.breadcrumLink.primary}
            >
              ALL USERS/{" "}
              <Box component={"span"} sx={{ fontWeight: "bold" }}>
                {headerTitle}
              </Box>
            </Typography>
          )}
          <IconButton sx={{ color: "#000000" }} onClick={closeEditUser}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container paddingX={3}>
          <Card>
            <Grid p={2}>
              <Grid item xs={12} display="flex" pb={2}>
                <Box
                  component="span"
                  sx={{ alignSelf: "self-end", textTransform: "capitalize" }}
                >
                  <Typography
                    fontSize={theme.typography.h3.fontSize}
                    fontWeight="bold"
                    color={theme.palette.blackFont.main}
                  >
                    {orgCode} Organization
                  </Typography>
                </Box>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Email ID"
                    id="emailId"
                    value={email}
                    formWidth="90%"
                    fieldName="emailId"
                    changeHandler={onEmailChanged}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Title"
                    id="title"
                    value={title}
                    formWidth="90%"
                    fieldName="title"
                    changeHandler={onTitleChanged}
                  />
                </Grid>
                <Grid item xs={3}>
                  <PhoneInput
                    style={{ alignItems: "normal" }}
                    defaultCountry="US"
                    value={phone}
                    id="phoneInput"
                    onChange={onPhoneChanged}
                    inputComponent={CustomPhoneNumber}
                    onFocus={() =>
                      setPhoneLabelColor(theme.palette.primary.main)
                    }
                    onBlur={() => setPhoneLabelColor("#616161")}
                    flags={flags}
                    rules={{ validate: (phone: any) => handleValidate(phone) }}
                    inputProps={{
                      error: phoneNumberInValid.toString(),
                      label: "Enter valid phone number",
                      name: "Phone",
                      width: "81.5%",
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Zip Code"
                    id="zipCode"
                    value={zip}
                    formWidth="90%"
                    fieldName="zip"
                    changeHandler={onZipChanged}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} mt={2}>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="First Name"
                    id="firstName"
                    formWidth="90%"
                    fieldName="firstName"
                    value={firstName}
                    changeHandler={onFirstNameChanged}
                    error={firstNameInvalid}
                    required={true}
                    helperText={
                      firstNameInvalid ? "First Name is Required" : ""
                    }
                    focusHandler={onFirstNameFocused}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Last Name"
                    id="lastName"
                    formWidth="90%"
                    fieldName="lastName"
                    value={lastName}
                    changeHandler={onLastNameChanged}
                    error={lastNameInvalid}
                    required={true}
                    helperText={lastNameInvalid ? "Last Name is Required" : ""}
                    focusHandler={onLastNameFocused}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Street"
                    id="street"
                    value={street}
                    formWidth="90%"
                    fieldName="street"
                    changeHandler={onStreetChanged}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="City"
                    id="city"
                    value={city}
                    formWidth="90%"
                    fieldName="city"
                    changeHandler={onCityChanged}
                  />
                </Grid>
              </Grid>
              <SelectSites orgCode={orgCode} modifiedData={setModifiedData} />
            </Grid>
          </Card>
          <Grid item xs={12} my={2}>
            <Box
              sx={{
                alignItems: "flex-end",
                display: "flex",
                justifyContent: isAddUser ? "end" : "space-between",
                paddingX: theme.spacing(0),
              }}
            >
              {isEditUser ? (
                <ActivateOrDeactiveUser
                  user={updatedUserInfo}
                  setActiveDate={onInActiveDateChanged}
                  setSnackbar={handleSnackbar}
                  setSnackBarType={handleSnackbarType}
                  setSnackBarMsg={handleSnackbarMsg}
                />
              ) : (
                <></>
              )}
              <Box>
                <Button
                  variant="outlined"
                  sx={{ marginRight: theme.spacing(2) }}
                  onClick={closeEditUser}
                >
                  BACK
                </Button>
                {isEditUser ? (
                  <Button
                    variant="outlined"
                    disabled={!userFormModified}
                    onClick={updateUserClick}
                  >
                    UPDATE USER
                  </Button>
                ) : (
                  <Button variant="outlined" onClick={saveUserClick}>
                    Save
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

