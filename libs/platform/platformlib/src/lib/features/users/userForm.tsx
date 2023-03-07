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
  addNewUser,
  setUserFormModified,
  getUserFormModified,
  selectOrgIDByDomain,
  selectOrgByOrgCode,
} from '@cloudcore/redux-store';
import { withStyles } from '@mui/styles';
import { ConfigCtx, IConfig, useOktaAuth } from '@cloudcore/okta-and-config';
import { Snackbar, Card, UnsavedData } from '@cloudcore/ui-shared';
import TitleAndCloseIcon from '../../components/TitleAndClose/TitleAndClose';
import { IAlert, IAlertData } from '@cloudcore/common-lib';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

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

const userValidationSchema = Yup.object({
  firstName: Yup.string().trim().required('First Name is Required'),
  lastName: Yup.string().trim().required('Last Name is Required'),
  email: Yup.string()
    .trim()
    .email('Invalid Email')
    .required('Email is Required'),
  phone: Yup.string()
    .trim()
    .test(
      'Phone number validation',
      'Enter valid phone number',
      function (value) {
        const phoneValue = value !== undefined ? value : '';
        const isValid =
          phoneValue === '' ? true : isPossiblePhoneNumber(phoneValue);
        return isValid;
      }
    ),
});

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
  const [orgCode, setOrgCode] = useState('');
  const selectedId: string = useAppSelector(selectedUserEmail);
  const user = useAppSelector(selectUserByIdEntity(selectedId)); //selectUserByIdEntity(selectedId));
  const updatedUserInfo = structuredClone(user);
  const org = useAppSelector((state) => selectOrgIDByDomain(state, selectedId));
  const userFormModified = useAppSelector(getUserFormModified);
  const getOrganization = useAppSelector((state: any) =>
    selectOrgByOrgCode(state, orgCode)
  );

  const initialValues = isEditUser
    ? {
        ...user,
        applications: selectedApps,
      }
    : {
        email: selectedId,
        firstName: '',
        lastName: '',
        title: '',
        phone: '',
        address: {
          street: '',
          city: '',
          zip: '',
          state: '',
        },
      };

  const onFirstNameChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setUserFormModified(true));
  };

  const onLastNameChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
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

  const onStreetChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setUserFormModified(true));
  };
  const onCityChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setUserFormModified(true));
  };
  const onStateChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setUserFormModified(true));
  };
  const onZipChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setUserFormModified(true));
  };

  const onTitleChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
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

  const closeEditUser = () => {
    userFormModified
      ? setDialogBoxOpen(true)
      : location.pathname.includes('editUser')
      ? history.push(`${path}user`, {
          currentPage: location.state?.currentPage,
          rowsPerPage: location.state?.rowsPerPage,
          filters: location.state?.filters,
          selectedId: user?.email,
        })
      : history.push(`${path}user/email`);
  };

  useEffect(() => {
    setOrgCode(org ? org : user?.orgCode ? user?.orgCode : '');
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

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...initialValues }}
      validationSchema={userValidationSchema}
      onSubmit={async (values) => {
        if (isEditUser) {
          const updatedUser = {
            ...values,
            email: values.email ? values.email?.trim() : '',
            firstName: values.firstName ? values.firstName?.trim() : '',
            lastName: values.lastName ? values.lastName?.trim() : '',
            title: values?.title ? values?.title?.trim() : '',
            phone: values?.phone ? values?.phone?.trim() : '',
            address: {
              street: values.address?.street
                ? values.address?.street.trim()
                : '',
              city: values?.address?.city ? values?.address?.city.trim() : '',
              zip: values?.address?.zip ? values?.address?.zip.trim() : '',
              state: values?.address?.state
                ? values?.address?.state.trim()
                : '',
            },
            applications: selectedApps,
            modifiedDate: new Date(),
          };

          dispatch(
            updateUser({
              user: updatedUser,
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
                    filters: location.state?.filters,
                    selectedId: user?.email,
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
        }

        if (isAddUser) {
          const newUser = {
            email: values.email ? values.email?.trim() : '',
            firstName: values.firstName ? values.firstName?.trim() : '',
            lastName: values.lastName ? values.lastName?.trim() : '',
            title: values?.title ? values?.title?.trim() : '',
            phone: values?.phone ? values?.phone?.trim() : '',
            address: {
              street: values.address?.street
                ? values.address?.street.trim()
                : '',
              city: values?.address?.city ? values?.address?.city.trim() : '',
              zip: values?.address?.zip ? values?.address?.zip.trim() : '',
              state: values?.address?.state
                ? values?.address?.state.trim()
                : '',
            },
            applications: selectedApps,
            id: selectedId ? selectedId.trim() : '',
            orgCode: orgCode ? orgCode?.trim() : '',
            inactiveDate: null,
            createdDate: new Date(),
            modifiedDate: new Date(),
          };

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
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form>
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
                        sx={{
                          alignSelf: 'self-end',
                          textTransform: 'capitalize',
                        }}
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
                        <Field name="email">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="Email ID"
                              fieldName="emailId"
                              formWidth="90%"
                              disabled={true}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={2.5}>
                        <Field name="firstName">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="First Name"
                              id="firstName"
                              fieldName="firstName"
                              formWidth="90%"
                              required={true}
                              error={
                                form.errors.firstName && form.touched.firstName
                              }
                              helperText={
                                form.touched.firstName && form.errors.firstName
                              }
                              formChangeHandler={onFirstNameChanged}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={2.5}>
                        <Field name="lastName">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="Last Name"
                              id="lastName"
                              fieldName="lastName"
                              formWidth="90%"
                              required={true}
                              error={
                                form.errors.lastName && form.touched.lastName
                              }
                              helperText={
                                form.touched.lastName && form.errors.lastName
                              }
                              formChangeHandler={onLastNameChanged}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={2}>
                        <Field name="title">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="Title"
                              id="title"
                              fieldName="title"
                              formWidth="90%"
                              formChangeHandler={onTitleChanged}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={2}>
                        <Field name="phone">
                          {({ field, form }: { field: any; form: any }) => {
                            const phoneError =
                              form.touched.phone && Boolean(form.errors.phone)
                                ? form.touched.phone &&
                                  Boolean(form.errors.phone)
                                : false;
                            return (
                              <PhoneInput
                                style={{ alignItems: 'normal' }}
                                defaultCountry="US"
                                id="phone"
                                value={field.value}
                                onChange={(value: any) => {
                                  if (value === undefined) {
                                    setFieldValue('phone', '');
                                  } else {
                                    setFieldValue('phone', value);
                                    dispatch(setUserFormModified(true));
                                  }
                                }}
                                inputComponent={CustomPhoneNumber}
                                flags={flags}
                                inputProps={{
                                  error: phoneError.toString(),
                                  label:
                                    form.touched.phone && form.errors.phone,
                                  width: '81.5%',
                                  name: 'Phone',
                                }}
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} mt={2}>
                      <Grid item xs={3}>
                        <Field name="address.street">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              id="address.street"
                              label="Street"
                              fieldName="street"
                              formWidth="90%"
                              formChangeHandler={onStreetChanged}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={2.5}>
                        <Field name="address.city">
                          {({ field, form }: { field: any; form: any }) => {
                            return (
                              <InputTextWithLabel
                                field={field}
                                value={field.value}
                                id="address.city"
                                label="City"
                                fieldName="city"
                                formWidth="90%"
                                formChangeHandler={onCityChanged}
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                      <Grid item xs={2.5}>
                        <Field name="address.state">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              id="address.state"
                              label="State/Prov"
                              fieldName="state"
                              formWidth="90%"
                              formChangeHandler={onStateChanged}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={2}>
                        <Field name="address.zip">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              id="address.zip"
                              label="Zip/Postal"
                              value={field.value}
                              fieldName="zip"
                              formWidth="90%"
                              formChangeHandler={onZipChanged}
                            />
                          )}
                        </Field>
                      </Grid>
                    </Grid>
                    <SelectSites
                      orgCode={orgCode}
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
                          type="submit"
                        >
                          UPDATE USER
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          type="submit"
                          data-testid="save"
                        >
                          Save
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
export default UserForm;
