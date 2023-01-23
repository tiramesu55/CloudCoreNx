/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, useContext, useMemo } from 'react';
import 'react-phone-number-input/style.css';
import { useHistory, useLocation } from 'react-router-dom';
import { platformStore } from '@cloudcore/redux-store';
import { Grid, Typography, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material';
import {
  InputTextWithLabel,
  SelectSites,
  PhoneInput as CustomPhoneNumber,
} from '../../components';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { DeactivateUser as ActivateOrDeactiveUser } from './ActivateOrDeactivateUser';
import {
  selectedUserEmail,
  selectUserByIdEntity,
  updateUser,
  currentApps,
  User,
  addNewUser,
  setUserFormModified,
  getUserFormModified,
  selectOrganizationByDomain,
  selectOrgByOrgCode,
} from '@cloudcore/redux-store';
import { withStyles } from '@mui/styles';
import { ConfigCtx, IConfig, useOktaAuth } from '@cloudcore/okta-and-config';
import { Snackbar, Card, UnsavedData } from '@cloudcore/ui-shared';
import TitleAndCloseIcon from '../../components/TitleAndClose/TitleAndClose';
import { IAlert, IAlertData } from '@cloudcore/common-lib';

const CustomCss = withStyles(() => ({
  '@global': {
    '.PhoneInputCountry': {
      alignItems: 'normal',
      marginTop: '32px',
    },
  },
}))(() => null);

const { useAppDispatch, useAppSelector } = platformStore;

interface Props {
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}
export const UserForm = (props: Props) => {
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { oktaAuth } = useOktaAuth();
  const token = oktaAuth?.getAccessToken();

  const theme = useTheme();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const location: any = useLocation();
  const selectedApps = useAppSelector(currentApps);

  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);

  const isAddUser = location.state?.from === 'addUser';
  const isEditUser = location.state?.from === 'editUser';

  const headerTitle = location.state?.title;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const selectedId: string = useAppSelector(selectedUserEmail);
  const user = useAppSelector(selectUserByIdEntity(selectedId)); //selectUserByIdEntity(selectedId));
  const updatedUserInfo = structuredClone(user);
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const org = useAppSelector((state) =>
    selectOrganizationByDomain(state, selectedId)
  );
  const [phoneLabelColor, setPhoneLabelColor] = useState('#616161');
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);
  const [phoneNumberInValid, setPhoneNumberInValid] = useState(false);
  const [modifiedData, setModifiedData] = useState(false);
  const userFormModified = useAppSelector(getUserFormModified);
  const getOrganization = useAppSelector((state: any) =>
    selectOrgByOrgCode(state, orgCode)
  );

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
  window.history.replaceState({ from: 'userForm' }, document.title);

  useEffect(() => {
    if (
      location.state === undefined &&
      location.pathname.includes('editUser')
    ) {
      history.replace(`${path}user/`, {
        from: 'editUser',
        task: 'navigateToUser',
      });
    } else if (
      location.state === undefined &&
      location.pathname.includes('addUser')
    ) {
      history.replace(`${path}user/email`, {
        from: 'addUser',
        task: 'navigateToAdd',
      });
    }
  }, [location.state, location.pathname, history, path]);

  const onLastNameFocused = (ele: HTMLInputElement) => {
    ele.value ? setLastNameInvalid(false) : setLastNameInvalid(true);
  };
  const onStreetChanged = (value: string) => {
    setStreet(value);
    dispatch(setUserFormModified(true));
  };
  const onCityChanged = (value: string) => {
    setCity(value);
    dispatch(setUserFormModified(true));
  };
  const onStateChanged = (value: string) => {
    setState(value);
    dispatch(setUserFormModified(true));
  };
  const onZipChanged = (value: string) => {
    setZip(value);
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

  const [snackbarRouting, setSnackbarRouting] = useState(() => {
    return () => {
      return;
    };
  });

  const updateUserClick = () => {
    try {
      setAddRequestStatus('pending');
      if (updatedUserInfo) {
        updatedUserInfo.firstName = firstName.trim();
        updatedUserInfo.lastName = lastName.trim();
        updatedUserInfo.address.street = street.trim();
        updatedUserInfo.address.city = city.trim();
        updatedUserInfo.address.state = state?.trim();
        updatedUserInfo.address.zip = zip.trim();
        updatedUserInfo.phone = phone.trim();
        updatedUserInfo.title = title.trim();
        updatedUserInfo.email = email.trim();
        updatedUserInfo.applications = selectedApps;
        updatedUserInfo.modifiedDate = new Date();
      }
      if (firstName && lastName && !phoneNumberInValid) {
        dispatch(
          updateUser({
            user: updatedUserInfo!,
            url: platformBaseUrl,
            token: token,
          })
        )
          .unwrap()
          .then(
            (value) => {
              handleOpenAlert({
                content: 'Changes were updated successfully',
                type: 'success',
              });
              setSnackbarRouting(
                history.push(`${path}user`, {
                  currentPage: location.state?.currentPage,
                  rowsPerPage: location.state?.rowsPerPage,
                })
              );
              dispatch(setUserFormModified(false));
            },
            (reason) => {
              handleOpenAlert({
                content: reason.message,
                type: 'error',
              });
            }
          );
      } else {
        if (firstName === '') {
          setFirstNameInvalid(true);
          document.getElementById('firstName')?.focus();
        }
        if (lastName === '') {
          setLastNameInvalid(true);
          document.getElementById('lastName')?.focus();
        }
        if (phoneNumberInValid) {
          document.getElementById('phoneInput')?.focus();
        }
      }
      // dispatch(selectUserID(""));
    } catch (err) {
      console.error('Failed to save the user', err);
    } finally {
      setAddRequestStatus('idle');
    }
  };

  const saveUserClick = () => {
    try {
      const newUser: User = {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        address: {
          street: street?.trim(),
          city: city?.trim(),
          state: state?.trim(),
          zip: zip?.trim(),
        },
        phone: phone?.trim(),
        title: title?.trim(),
        email: email?.trim(),
        applications: selectedApps,
        id: email?.trim(),
        orgCode: orgCode?.trim(),
        inactiveDate: null,
        createdDate: new Date(),
        modifiedDate: new Date(),
      };
      if (firstName && lastName && !phoneNumberInValid) {
        dispatch(
          addNewUser({
            user: newUser,
            url: platformBaseUrl,
            token: token,
          })
        )
          .unwrap()
          .then(
            (value) => {
              handleOpenAlert({
                content: 'User added successfully',
                type: 'success',
              });
              setSnackbarRouting(history.push(`${path}user/`));
              dispatch(setUserFormModified(false));
            },
            (reason) => {
              handleOpenAlert({
                content: reason.message,
                type: 'error',
              });
            }
          );
      } else {
        if (firstName === '') {
          setFirstNameInvalid(true);
          document.getElementById('firstName')?.focus();
        }
        if (lastName === '') {
          setLastNameInvalid(true);
          document.getElementById('lastName')?.focus();
        }
        if (phoneNumberInValid) {
          document.getElementById('phoneInput')?.focus();
        }
      }
    } catch (err) {
      console.error('Failed to save the user', err);
    } finally {
      setAddRequestStatus('idle');
    }
  };

  const closeEditUser = () => {
    userFormModified
      ? setDialogBoxOpen(true)
      : location.pathname.includes('editUser')
      ? history.push(`${path}user`, {
          currentPage: location.state?.currentPage,
          rowsPerPage: location.state?.rowsPerPage,
        })
      : history.push(`${path}user/email`);
  };

  useEffect(() => {
    setEmail(selectedId);
    setOrgCode(org ? org : user?.orgCode ? user?.orgCode : '');
    if (user !== undefined && isEditUser) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setStreet(user.address.street);
      setCity(user.address.city);
      setState(user.address.state);
      setZip(user.address.zip);
      setPhone(user.phone);
      setTitle(user.title);
      setOrgCode(user.orgCode);
    }
  }, [selectedId, user, isEditUser, isAddUser, org]);

  /* Code to provide popup on reload of Add/edit user page, when data is modified */
  useEffect(() => {
    const preventUnload = (event: BeforeUnloadEvent) => {
      // NOTE: This message isn't used in modern browsers, but is required
      const message = 'Sure you want to leave?';
      event.preventDefault();
      event.returnValue = message;
    };
    if (userFormModified) {
      window.addEventListener('beforeunload', preventUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, [userFormModified]);

  const handleValidate = (value: any) => {
    const isValid = isPossiblePhoneNumber(value);
    isValid ? setPhoneNumberInValid(false) : setPhoneNumberInValid(true);
    return isValid;
  };

  return (
    <Grid container spacing={1}>
      <CustomCss />
      <Snackbar
        open={alertData.openAlert}
        type={alertData.type}
        content={alertData.content}
        onClose={() => {
          handleCloseAlert();
          snackbarRouting();
        }}
        duration={3000}
      />
      {
        <UnsavedData
          open={dialogBoxOpen}
          handleLeave={handleDialogBox}
          location="users"
        />
      }
      <Grid item xs={12}>
        <TitleAndCloseIcon
          onClickButton={closeEditUser}
          breadCrumbOrigin={isAddUser ? 'Add New User' : 'All Users'}
          breadCrumbTitle={isAddUser ? '' : headerTitle}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container paddingX={3}>
          <Card>
            <Grid p={2}>
              <Grid item xs={12} display="flex" pb={2}>
                <Box
                  component="span"
                  sx={{ alignSelf: 'self-end', textTransform: 'capitalize' }}
                >
                  <Typography
                    fontSize={theme.typography.h3.fontSize}
                    fontWeight="bold"
                    color={theme.palette.blackFont.main}
                  >
                    {getOrganization && getOrganization.name} Organization
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
                    data-testid="emailid"
                  />
                </Grid>
                <Grid item xs={2.5}>
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
                      firstNameInvalid ? 'First Name is Required' : ''
                    }
                    focusHandler={onFirstNameFocused}
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <InputTextWithLabel
                    label="Last Name"
                    id="lastName"
                    formWidth="90%"
                    fieldName="lastName"
                    value={lastName}
                    changeHandler={onLastNameChanged}
                    error={lastNameInvalid}
                    required={true}
                    helperText={lastNameInvalid ? 'Last Name is Required' : ''}
                    focusHandler={onLastNameFocused}
                  />
                </Grid>
                <Grid item xs={2}>
                  <InputTextWithLabel
                    label="Title"
                    id="title"
                    value={title}
                    formWidth="90%"
                    fieldName="title"
                    changeHandler={onTitleChanged}
                  />
                </Grid>
                <Grid item xs={2}>
                  <PhoneInput
                    style={{ alignItems: 'normal' }}
                    defaultCountry="US"
                    value={phone}
                    id="phoneInput"
                    onChange={onPhoneChanged}
                    inputComponent={CustomPhoneNumber}
                    onFocus={() =>
                      setPhoneLabelColor(theme.palette.primary.main)
                    }
                    onBlur={() => setPhoneLabelColor('#616161')}
                    flags={flags}
                    rules={{ validate: (phone: any) => handleValidate(phone) }}
                    inputProps={{
                      error: phoneNumberInValid.toString(),
                      label: 'Enter valid phone number',
                      name: 'Phone',
                      width: '81.5%',
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} mt={2}>
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
                <Grid item xs={2.5}>
                  <InputTextWithLabel
                    label="City"
                    id="city"
                    value={city}
                    formWidth="90%"
                    fieldName="city"
                    changeHandler={onCityChanged}
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <InputTextWithLabel
                    label="State/Prov"
                    id="state"
                    value={state}
                    formWidth="90%"
                    fieldName="state"
                    changeHandler={onStateChanged}
                  />
                </Grid>
                <Grid item xs={2}>
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
              <SelectSites
                orgCode={orgCode}
                modifiedData={setModifiedData}
                handleOpenAlert={handleOpenAlert}
                handleCloseAlert={handleCloseAlert}
                alertData={alertData}
              />
            </Grid>
          </Card>
          <Grid item xs={12} my={2}>
            <Box
              sx={{
                alignItems: 'flex-end',
                display: 'flex',
                justifyContent: isAddUser ? 'end' : 'space-between',
                paddingX: theme.spacing(0),
              }}
            >
              {isEditUser && (
                <ActivateOrDeactiveUser
                  user={updatedUserInfo}
                  setActiveDate={onInActiveDateChanged}
                  openAlert={handleOpenAlert}
                  closeAlert={handleCloseAlert}
                />
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
                  <Button variant="outlined" onClick={saveUserClick} data-testid="save">
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
export default UserForm;