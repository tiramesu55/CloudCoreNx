/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Grid, Typography, Button, Stack, useTheme } from '@mui/material';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import {
  InputTextWithLabel,
  PhoneInput as CustomPhoneNumber,
} from '../../components';
import {
  InfoCard,
  Card,
  Snackbar,
  sites_img,
  users_img,
  location_img,
  UnsavedData,
} from '@cloudcore/ui-shared';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import {
  createOrganizationAsync,
  organizationSelector,
  selectedOrganization,
  selectedId,
  Organization,
  resetOrganization,
  setOrganization,
  updateOrganizationAsync,
  getOrganizationStatsAsync,
  organizationStats,
  getAllOrganizationsDomains,
  selectOrgByOrgCode,
  getOrgFormModified,
  setOrgFormModified,
  fetchUsers,
  resetSite,
  getPostLogoutRedirectUrl,
} from '@cloudcore/redux-store';
import { platformStore } from '@cloudcore/redux-store';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ActivateDeactivateOrg } from './activate-deactivate-org';
import { withStyles } from '@mui/styles';
import { OrgDomainModal } from './orgDomainModal';
import {
  ConfigCtx,
  IConfig,
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import TitleAndCloseIcon from '../../components/TitleAndClose/TitleAndClose';
import { IAlert, IAlertData } from '@cloudcore/common-lib';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { OrgDomainAutoComplete } from '../../components/org-auto-complete/OrgDomainAutoComplete';

const { useAppDispatch, useAppSelector } = platformStore;
const CustomCss = withStyles(() => ({
  '@global': {
    '.PhoneInputCountry': {
      alignItems: 'normal',
      marginTop: '32px',
    },
  },
}))(() => null);

interface Props {
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}

const orgValidationSchema = Yup.object({
  orgCode: Yup.string().trim().required('Organization Code is Required'),
  name: Yup.string().trim().required('Organization Name is Required'),
  description: Yup.string()
    .trim()
    .required('Organization Description is Required'),
  officeEmail: Yup.string()
    .trim()
    .email('Invalid Email')
    .required('Email is Required'),
  address: Yup.object({
    state: Yup.string().trim().required('State is Required'),
    city: Yup.string().trim().required('City is Required'),
    zip: Yup.string().trim().required('Zip is Required'),
    street: Yup.string().trim().required('Street is Required'),
  }),
  postLogoutRedirectUrl: Yup.string()
    .trim()
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
      'Invalid URL'
    )
    .required('Post Redirect Url is Required'),
  orgDomains: Yup.array()
    .of(Yup.string().min(1, 'Field is required'))
    .min(1, 'Atleast One Domain Required'),
  officePhone: Yup.string()
    .trim()
    .required('Phone Number is Required')
    .test(
      'Phone number validation',
      'Enter valid phone number',
      function (value) {
        const phoneValue = value !== undefined ? value : '';
        const isValid = isPossiblePhoneNumber(phoneValue);
        return isValid;
      }
    ),
});

export const OrganizationForm = (props: Props) => {
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  const config: IConfig = useContext(ConfigCtx) as IConfig; // at this point config is not null (see app)
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token, permissions } = useClaimsAndSignout() as UseClaimsAndSignout;
  const disableEditDomain = (permissions.get('admin') ?? []).includes('global');
  const theme = useTheme();
  const organization = useAppSelector(selectedOrganization);
  const { platformBaseUrl } = config; // at this point config is not null (see app)

  const selected = useAppSelector(selectedId);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location: any = useLocation();
  const [orgDomain, setOrgDomain] = useState('');
  const [phoneNumberInValid, setPhoneNumberInValid] = useState(false);
  const selectOrgByID = useSelector((state: any) =>
    organizationSelector.selectById(state, selected)
  );
  const selectedOrgStats = useAppSelector(organizationStats);
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const orgFormModified = useAppSelector(getOrgFormModified);
  const [orgDomainDialogOpen, setOrgDomainDialogOpen] = useState(false);
  const [orgDomainList, setOrgDomainList] = useState<string[]>([]);
  const adminRightsEnabled = (permissions.get('admin') ?? []).includes(
    'global'
  );
  const isAddOrganization = location.state?.from === 'addOrganization';
  const isEditOrganization =
    location.state?.from === 'editOrganization' ||
    location.state?.from === 'siteForm';

  const isEditOrganizationRedirect = location.state?.from === 'siteFormEdit';

  const initialValues: Organization = {
    ...organization,
  };

  useEffect(() => {
    if (isEditOrganization) {
      dispatch(setOrganization(selectOrgByID ? selectOrgByID : organization));
      setOrgDomain(organization?.orgDomains[0]);
      setOrgDomainList(organization?.orgDomains);
    }
  }, [organization?.orgDomains]);

  const retrieveData = window.localStorage.getItem('orgData');
  const orgData = JSON.parse(retrieveData as any);
  const getOrganization = useAppSelector((state: any) =>
    selectOrgByOrgCode(state, orgData?.orgCode)
  );

  useEffect(() => {
    if (
      location.state?.from === 'siteFormEdit' &&
      getOrganization !== undefined
    ) {
      dispatch(setOrganization(getOrganization));
      setOrgDomain(getOrganization?.orgDomains[0]);
      setOrgDomainList(getOrganization?.orgDomains);
    }
  }, [getOrganization]);

  useEffect(() => {
    if (isAddOrganization) {
      dispatch(resetOrganization());
      dispatch(
        getAllOrganizationsDomains({
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            //Do Nothing
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
      setOrgDomain('');
    }
  }, []);

  useEffect(() => {
    dispatch(
      fetchUsers({
        url: platformBaseUrl,
        token: token,
      })
    )
      .unwrap()
      .then(
        (value: any) => {
          //Do Nothing
        },
        (reason: any) => {
          handleOpenAlert({
            content: reason.message,
            type: 'error',
          });
        }
      );
  }, []);

  useEffect(() => {
    const storedOrgData = JSON.parse(
      window.localStorage.getItem('orgData') as any
    );
    if (isEditOrganization || isEditOrganizationRedirect) {
      dispatch(
        getOrganizationStatsAsync({
          orgCode: selectOrgByID?.orgCode
            ? selectOrgByID?.orgCode
            : storedOrgData?.orgCode,
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            //Do Nothing
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
      dispatch(
        getAllOrganizationsDomains({
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            //Do Nothing
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    }
  }, []);

  // orgDomain handlers
  const handleOrgDomainDialog = (value: boolean) => {
    setOrgDomainDialogOpen(value);
  };
  //orgDomain handlers

  const handleOrgCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setOrgFormModified(true));
  };

  const handleOrgNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setOrgFormModified(true));
  };

  const handleOrgDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setOrgFormModified(true));
  };

  const handleValidate = (value: any) => {
    const isValid = isPossiblePhoneNumber(value);
    isValid ? setPhoneNumberInValid(false) : setPhoneNumberInValid(true);
    return isValid;
  };

  /* Code to provide popup on reload of Add/edit org page, when data is modified */
  useEffect(() => {
    const preventUnload = (event: BeforeUnloadEvent) => {
      // NOTE: This message isn't used in modern browsers, but is required
      const message = 'Sure you want to leave?';
      event.preventDefault();
      event.returnValue = message;
    };
    if (orgFormModified) {
      window.addEventListener('beforeunload', preventUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, [orgFormModified]);

  window.history.replaceState({ from: 'userForm' }, document.title);

  useEffect(() => {
    if (
      location.state === undefined &&
      location.pathname.includes('editOrganization')
    ) {
      history.replace(path, {
        from: 'editOrganization',
        task: 'navigateToDashboard',
      });
    } else if (
      location.state === undefined &&
      location.pathname.includes('addOrganization')
    ) {
      history.replace(path, {
        from: 'addOrganization',
        task: 'navigateToDashboard',
      });
    }
  }, [location.state, location.pathname, history]);
  /* End of code to provide popup on reload of Add/edit org page */

  const handleDialogBox = (open: boolean) => {
    setDialogBoxOpen(open);
  };

  const closeOrganizationForm = () => {
    orgFormModified ? setDialogBoxOpen(true) : history.push(path);
  };

  const handleOfficeEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setOrgFormModified(true));
  };

  const handlePostRedirectUrl = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setOrgFormModified(true));
  };

  const handleChangeStreet = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setOrgFormModified(true));
  };

  const handleChangeCity = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setOrgFormModified(true));
  };

  const handleChangeState = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setOrgFormModified(true));
  };

  const handleChangeZip = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setOrgFormModified(true));
  };

  const [snackbarRouting, setSnackbarRouting] = useState(() => {
    return () => {
      return;
    };
  });

  const loggedInOrgCode = useAppSelector((state) => state.maintenance.orgCode);

  const addNewSite = () => {
    history.push(`${path}organization/editOrg/addSite`, {
      title: 'Add Site',
      task: 'addSite',
      from: 'organizationForm',
      orgCode: organization.orgCode,
      orgName: organization['name'],
    });
    dispatch(resetSite());
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...initialValues }}
      validationSchema={orgValidationSchema}
      onSubmit={async (values) => {
        if (isAddOrganization) {
          const newOrganization = {
            name: values.name.trim(),
            id: values.orgCode.trim(),
            orgCode: values.orgCode.trim(),
            description: values?.description?.trim(),
            orgDomains: [...values.orgDomains],
            officeEmail: values?.officeEmail?.trim(),
            officePhone: values?.officePhone?.trim(),
            address: {
              state: values.address.state.trim(),
              city: values.address.city.trim(),
              street: values.address.street.trim(),
              zip: values.address.zip.trim(),
            },
            root: values.root,
            orgAdmins: [],
            createdDate: new Date(),
            modifiedDate: new Date(),
            createdBy: null,
            modifiedBy: null,
            childOrgs: [],
            postLogoutRedirectUrl: values.postLogoutRedirectUrl.trim(),
          };
          dispatch(
            createOrganizationAsync({
              organization: newOrganization,
              url: platformBaseUrl,
              token: token,
            })
          )
            .unwrap()
            .then(
              () => {
                handleOpenAlert({
                  content: 'Organization added successfully',
                  type: 'success',
                });
                setSnackbarRouting(history.push(path));
                dispatch(setOrgFormModified(false));
              },
              (reason: any) => {
                handleOpenAlert({
                  content: reason.message,
                  type: 'error',
                });
              }
            );
        }
        if (isEditOrganization || isEditOrganizationRedirect) {
          const updatedOrganization = {
            ...values,
            name: values.name.trim(),
            orgCode: values.orgCode.trim(),
            description: values?.description?.trim(),
            orgDomains: values?.orgDomains,
            officeEmail: values?.officeEmail?.trim(),
            officePhone: values?.officePhone?.trim(),
            address: {
              state: values.address.state.trim(),
              city: values.address.city.trim(),
              street: values.address.street.trim(),
              zip: values.address.zip.trim(),
            },
            postLogoutRedirectUrl: values.postLogoutRedirectUrl.trim(),
          };
          dispatch(
            updateOrganizationAsync({
              organization: updatedOrganization,
              url: platformBaseUrl,
              token: token,
            })
          )
            .unwrap()
            .then(
              () => {
                if (loggedInOrgCode === organization.orgCode) {
                  dispatch(
                    getPostLogoutRedirectUrl({
                      orgCode: loggedInOrgCode,
                      url: platformBaseUrl,
                      token: token,
                    })
                  )
                    .unwrap()
                    .then(
                      (value: any) => {
                        //Do Nothing
                      },
                      (reason: any) => {
                        handleOpenAlert({
                          content: reason.message,
                          type: 'error',
                        });
                      }
                    );
                }
                dispatch(setOrgFormModified(false));
                handleOpenAlert({
                  content: 'Changes were updated successfully',
                  type: 'success',
                });
                setSnackbarRouting(history.push(path));
              },
              (reason: any) => {
                handleOpenAlert({
                  content: reason.message,
                  type: 'error',
                });
              }
            );
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Grid container spacing={1}>
            <CustomCss />
            {
              <UnsavedData
                open={dialogBoxOpen}
                handleLeave={handleDialogBox}
                location="organization"
              />
            }
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
              <OrgDomainModal
                open={orgDomainDialogOpen}
                handleDialog={handleOrgDomainDialog}
                orgDomains={values.orgDomains}
              />
            }
            <Grid xs={12} item>
              <Box>
                <TitleAndCloseIcon
                  onClickButton={closeOrganizationForm}
                  breadCrumbOrigin={
                    isAddOrganization
                      ? 'Dashboard'
                      : `Dashboard / ${organization['name']} Organization`
                  }
                  breadCrumbTitle={
                    isAddOrganization
                      ? 'Add New Organization'
                      : 'Edit Organization'
                  }
                  addBtn={!isAddOrganization && adminRightsEnabled}
                  onClickAddBtn={addNewSite}
                  addBtnText="ADD NEW SITE"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container paddingX={3}>
                <Card
                  style={{
                    paddingLeft: '30px',
                    paddingRight: '30px',
                    paddingTop: '30px',
                    paddingBottom: '74px',
                  }}
                >
                  <Grid item xs={12}>
                    <Typography
                      sx={{ paddingBottom: theme.spacing(2.5) }}
                      fontSize={theme.typography.h3.fontSize}
                      fontWeight="bold"
                      color="#000000"
                    >
                      {isAddOrganization
                        ? 'New Organization Details'
                        : 'Edit Organization Details'}
                    </Typography>
                  </Grid>
                  {(isEditOrganization || isEditOrganizationRedirect) && (
                    <Grid item xs={12} sx={{ paddingBottom: theme.spacing(3) }}>
                      <Stack
                        direction="row"
                        sx={{ alignItems: 'center' }}
                        spacing={2.5}
                      >
                        <Typography
                          sx={{
                            fontSize: theme.typography.h3.fontSize,
                            fontWeight: 'bold',
                            color: '#333333',
                          }}
                        >
                          {organization['name']?.toUpperCase()}
                        </Typography>
                        <Box>
                          <Box
                            component={'img'}
                            src={location_img}
                            alt="location"
                            sx={{ mr: 1 }}
                            color="#808184"
                          />
                          <Typography component={'span'} variant="body2">
                            {`${organization['address']?.street}, ${organization['address']?.city}`}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid xs={3} item>
                        <Field name="orgCode">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="Organization Code"
                              id="orgCode"
                              fieldName="orgCode"
                              formWidth="90%"
                              error={
                                form.errors.orgCode && form.touched.orgCode
                              }
                              helperText={
                                form.touched.orgCode && form.errors.orgCode
                              }
                              orgChangeHandler={handleOrgCodeChange}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid xs={3} item>
                        <Field name="name">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="Organization Name"
                              id="name"
                              fieldName="name"
                              formWidth="90%"
                              error={form.errors.name && form.touched.name}
                              helperText={form.touched.name && form.errors.name}
                              orgChangeHandler={handleOrgNameChange}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid xs={3} item>
                        <Field name="description">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              label="Description"
                              id="description"
                              value={field.value}
                              orgChangeHandler={handleOrgDescriptionChange}
                              fieldName="description"
                              formWidth="90%"
                              error={
                                form.errors.description &&
                                form.touched.description
                              }
                              helperText={
                                form.touched.description &&
                                form.errors.description
                              }
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid xs={3} item>
                        <OrgDomainAutoComplete
                          name="orgDomains"
                          disableEditDomain={disableEditDomain}
                          orgDomainHandler={handleOrgDomainDialog}
                          isAddOrganization={isAddOrganization}
                        />
                      </Grid>
                      <Grid xs={3} item>
                        <Field name="officeEmail">
                          {({ field, form }: { field: any; form: any }) => {
                            return (
                              <InputTextWithLabel
                                field={field}
                                value={field.value}
                                id="officeEmail"
                                label="Office Email"
                                fieldName="officeEmail"
                                formWidth="90%"
                                orgChangeHandler={handleOfficeEmailChange}
                                error={
                                  form.errors.officeEmail &&
                                  form.touched.officeEmail
                                }
                                helperText={
                                  form.touched.officeEmail &&
                                  form.errors.officeEmail
                                }
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                      <Grid xs={3} item>
                        <Field name="officePhone">
                          {({ field, form }: { field: any; form: any }) => {
                            const phoneError =
                              form.touched.officePhone &&
                              Boolean(form.errors.officePhone)
                                ? form.touched.officePhone &&
                                  Boolean(form.errors.officePhone)
                                : false;
                            return (
                              <PhoneInput
                                style={{ alignItems: 'normal' }}
                                defaultCountry="US"
                                id="officePhone"
                                value={field.value}
                                onChange={(value: any) => {
                                  if (value) {
                                    const isValid =
                                      isPossiblePhoneNumber(value);
                                    isValid
                                      ? setPhoneNumberInValid(false)
                                      : setPhoneNumberInValid(true);
                                  }
                                  if (value === undefined) {
                                    setFieldValue('officePhone', '');
                                  } else {
                                    setFieldValue('officePhone', value);
                                    dispatch(setOrgFormModified(true));
                                  }
                                }}
                                inputComponent={CustomPhoneNumber}
                                flags={flags}
                                rules={{
                                  validate: (phone: any) =>
                                    handleValidate(phone),
                                }}
                                inputProps={{
                                  error: phoneError.toString(),
                                  label:
                                    form.touched.officePhone &&
                                    form.errors.officePhone,
                                  width: '81.5%',
                                  name: 'Phone',
                                }}
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                      <Grid xs={3} item>
                        <Field name="address.street">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              id="address.street"
                              label="Street"
                              fieldName="street"
                              formWidth="90%"
                              orgChangeHandler={handleChangeStreet}
                              error={
                                form.errors?.address?.street &&
                                form.touched?.address?.street
                              }
                              helperText={
                                form.touched?.address?.street &&
                                form.errors?.address?.street
                              }
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid xs={3} item>
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
                                orgChangeHandler={handleChangeCity}
                                error={
                                  form.errors?.address?.city &&
                                  form.touched?.address?.city
                                }
                                helperText={
                                  form.touched?.address?.city &&
                                  form.errors?.address?.city
                                }
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                      <Grid xs={3} item>
                        <Field name="address.state">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              id="address.state"
                              label="State/Prov"
                              fieldName="state"
                              formWidth="90%"
                              orgChangeHandler={handleChangeState}
                              error={
                                form.errors?.address?.state &&
                                form.touched?.address?.state
                              }
                              helperText={
                                form.touched?.address?.state &&
                                form.errors?.address?.state
                              }
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid xs={3} item>
                        <Field name="address.zip">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              id="address.zip"
                              label="Zip/Postal"
                              value={field.value}
                              fieldName="zip"
                              formWidth="90%"
                              orgChangeHandler={handleChangeZip}
                              error={
                                form.errors?.address?.zip &&
                                form.touched?.address?.zip
                              }
                              helperText={
                                form.touched?.address?.zip &&
                                form.errors?.address?.zip
                              }
                            />
                          )}
                        </Field>
                      </Grid>
                      {adminRightsEnabled && (
                        <Grid xs={3} item>
                          <Field name="postLogoutRedirectUrl">
                            {({ field, form }: { field: any; form: any }) => (
                              <InputTextWithLabel
                                field={field}
                                id="postLogoutRedirectUrl"
                                label="Post Redirect Url"
                                fieldName="postLogoutRedirectUrl"
                                formWidth="90%"
                                value={field.value}
                                orgChangeHandler={handlePostRedirectUrl}
                                error={
                                  form.errors.postLogoutRedirectUrl &&
                                  form.touched.postLogoutRedirectUrl
                                }
                                helperText={
                                  form.touched.postLogoutRedirectUrl &&
                                  form.errors.postLogoutRedirectUrl
                                }
                              />
                            )}
                          </Field>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  {(isEditOrganization || isEditOrganizationRedirect) && (
                    <Grid xs={12} item>
                      <Typography
                        sx={{ paddingY: theme.spacing(3.7) }}
                        fontSize={theme.typography.h3.fontSize}
                        fontWeight="bold"
                        color="#000000"
                      >
                        Organization Details
                      </Typography>
                    </Grid>
                  )}
                  {(isEditOrganization || isEditOrganizationRedirect) && (
                    <Grid
                      xs={12}
                      item
                      sx={{ paddingBottom: theme.spacing(3.7) }}
                    >
                      <Grid container spacing={2}>
                        <Grid xs={3} item>
                          <InfoCard
                            image={sites_img}
                            title="Sites"
                            count={selectedOrgStats?.sites}
                            editSites={true}
                            orgCode={organization.orgCode}
                            orgName={organization.name}
                          />
                        </Grid>
                        <Grid xs={3} item>
                          <InfoCard
                            image={users_img}
                            title="Users"
                            count={selectedOrgStats?.users}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Card>
              </Grid>
            </Grid>
            <Grid xs={12} item my={2}>
              <Box
                sx={{
                  alignItems: 'flex-end',
                  display: 'flex',
                  justifyContent: isAddOrganization ? 'end' : 'space-between',
                  paddingX: theme.spacing(3),
                }}
              >
                {(isEditOrganization || isEditOrganizationRedirect) && (
                  <Box>
                    {adminRightsEnabled && (
                      <ActivateDeactivateOrg
                        orgDomain={orgDomain}
                        openAlert={handleOpenAlert}
                        closeAlert={handleCloseAlert}
                        orgData={orgData}
                      />
                    )}
                  </Box>
                )}
                <Box>
                  <Button
                    variant="outlined"
                    onClick={closeOrganizationForm}
                    sx={{
                      fontSize: theme.typography.subtitle1.fontSize,
                      fontWeight: 'bold',
                      paddingX: theme.spacing(6),
                      paddingY: theme.spacing(1.1),
                      marginRight: theme.spacing(3),
                    }}
                  >
                    BACK
                  </Button>
                  {isAddOrganization ? (
                    <Button
                      type="submit"
                      variant="outlined"
                      sx={{
                        fontSize: theme.typography.subtitle1.fontSize,
                        fontWeight: 'bold',
                        paddingX: theme.spacing(4),
                        paddingY: theme.spacing(1.1),
                      }}
                    >
                      ADD ORGANIZATION
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      disabled={!orgFormModified}
                      type="submit"
                      sx={{
                        fontSize: theme.typography.subtitle1.fontSize,
                        fontWeight: 'bold',
                        paddingX: theme.spacing(4),
                        paddingY: theme.spacing(1.1),
                      }}
                    >
                      UPDATE ORGANIZATION
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
