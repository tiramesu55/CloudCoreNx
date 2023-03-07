/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Box, Typography, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { platformStore } from '@cloudcore/redux-store';
import {
  InputTextWithLabel,
  PhoneInput as CustomPhoneNumber,
} from '../../components';
import { Card, Snackbar, UnsavedData } from '@cloudcore/ui-shared';
import flags from 'react-phone-number-input/flags';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';
import { withStyles } from '@mui/styles';
import { ApplicationSiteForm } from './applicationSiteForm';
import { useEffect } from 'react';
import {
  selectedId,
  createSite,
  getSiteFormModified,
  selectedSite,
  setSiteFormModified,
  Site,
  updateSite,
  updateSiteField,
} from '@cloudcore/redux-store';
import { ActivateDeactivateSite } from './activate-deactivate-site';
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

const { useAppDispatch, useAppSelector } = platformStore;
interface Application {
  appCode: string;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
}
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

const siteValidationSchema = Yup.object({
  siteName: Yup.string().trim().required('Site Name is Required'),
  siteIdentifier: Yup.string().trim().required('Site Indentifier is Required'),
  siteCode: Yup.string().trim().required('Site Code is Required'),
  serviceEmail: Yup.string()
    .trim()
    .email('Invalid Email')
    .required('Email is Required'),
  address: Yup.object({
    state: Yup.string().trim().required('State is Required'),
    city: Yup.string().trim().required('City is Required'),
    zip: Yup.string().trim().required('Zip is Required'),
    street: Yup.string().trim().required('Street is Required'),
  }),
  phone: Yup.string()
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

export const SiteForm = (props: Props) => {
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token, permissions } = useClaimsAndSignout() as UseClaimsAndSignout;

  const theme = useTheme();
  const site = useAppSelector(selectedSite);
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const dispatch = useAppDispatch();
  const location: any = useLocation();
  const isAddSite =
    location.state?.from === 'dashboard' ||
    location.state?.from === 'organizationForm' ||
    location.state?.from === 'addSite';
  const isEditSite = location.state?.from === 'editSite';
  const history = useHistory();
  const selected = useAppSelector(selectedId);
  const adminRightsEnabled = (permissions.get('admin') ?? []).includes(
    'global'
  );
  const [siteApplications, setSiteApplications] = useState<Application[]>(
    site.applications
  );

  const siteInitialValues = {
    id: site?.id,
    siteName: site?.siteName,
    siteCode: site?.siteCode,
    serviceEmail: site?.serviceEmail,
    siteIdentifier: site?.siteIdentifier,
    phone: site?.phone,
    address: {
      street: site?.address?.street,
      city: site?.address?.city,
      state: site?.address?.state,
      zip: site?.address?.zip,
    },
    inactiveDate: site?.inactiveDate,
    configPath: site?.configPath,
    description: site?.description,
    createdDate: site?.createdDate,
  };
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const siteFormModified = useAppSelector(getSiteFormModified);

  useEffect(() => {
    setSiteApplications(site.applications);
  }, [site.applications]);

  const handleSiteApplicationChange = (value: any) => {
    setSiteApplications(value);
    dispatch(
      updateSiteField({ key: 'applications', value: value, id: selected })
    );
    dispatch(setSiteFormModified(true));
  };

  const getOrgData = () => {
    const retrieveData = window.localStorage.getItem('orgData');
    const updatedorgData = JSON.parse(retrieveData as any);
    return updatedorgData;
  };
  let orgData: any = location?.state
    ? {
        orgCode: location?.state?.orgCode,
        orgName: location?.state?.orgName,
      }
    : getOrgData();

  useEffect(() => {
    if (location.state !== undefined && location?.state?.orgCode !== '') {
      window.localStorage.removeItem('orgData');
      window.localStorage.removeItem('orgCode');
      window.localStorage.setItem('orgData', JSON.stringify(orgData));
    } else {
      const retrieveData = window.localStorage.getItem('orgData');
      orgData = JSON.parse(retrieveData as any);
    }
  }, []);

  const closeSiteForm = () => {
    if (location.state?.from === 'dashboard') {
      siteFormModified
        ? setDialogBoxOpen(true)
        : history.push(`${path}`, {
            from: 'siteForm',
            orgCode: orgData.orgCode,
            orgName: orgData.orgName,
          });
    } else {
      siteFormModified
        ? setDialogBoxOpen(true)
        : history.push(`${path}organization/sites`, {
            from: 'siteForm',
            orgCode: orgData.orgCode,
            orgName: orgData.orgName,
          });
    }
  };

  const handleChangeSiteName = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeSiteCode = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeSiteIndentifier = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeEmail = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeStreet = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeCity = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeState = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeZip = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: any
  ) => {
    onChange(event);
    dispatch(setSiteFormModified(true));
  };
  /* Code to provide popup on reload of Add/edit site page, when data is modified */
  useEffect(() => {
    const preventUnload = (event: BeforeUnloadEvent) => {
      // NOTE: This message isn't used in modern browsers, but is required
      const message = 'Sure you want to leave?';
      event.preventDefault();
      event.returnValue = message;
    };
    if (siteFormModified) {
      window.addEventListener('beforeunload', preventUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, [siteFormModified]);

  window.history.replaceState({ from: 'siteForm' }, document.title);
  useEffect(() => {
    if (
      location.state === undefined &&
      location.pathname.includes('/organization/editSite')
    ) {
      history.push(`${path}organization/sites`, {
        from: 'editSite',
        task: 'navigateToDashboard',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
    } else if (
      location.state === undefined &&
      location.pathname.includes('/organization/addSite')
    ) {
      history.push(`${path}organization/sites`, {
        from: 'addSite',
        task: 'navigateToDashboard',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
    } else if (
      location.state === undefined &&
      location.pathname.includes('/editOrg/addSite')
    ) {
      history.push(`${path}`, {
        from: 'siteFormEdit',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
    }
  }, []);
  /* End of code to provide popup on reload of Add/edit org page */

  const handleDialogBox = (open: boolean) => {
    setDialogBoxOpen(open);
  };

  const [snackbarRouting, setSnackbarRouting] = useState(() => {
    return () => {
      return;
    };
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...siteInitialValues }}
      validationSchema={siteValidationSchema}
      onSubmit={async (values) => {
        const hasError =
          document.querySelectorAll<HTMLElement>('.Mui-error').length > 0;
        if (!hasError) {
          if (isAddSite) {
            const newSite: {} = {
              siteCode: values.siteCode ? values.siteCode.trim() : '',
              siteName: values.siteName ? values.siteName.trim() : '',
              siteIdentifier: values.siteIdentifier
                ? values.siteIdentifier.trim()
                : '',
              orgCode: location.state.orgCode
                ? location.state.orgCode.trim()
                : '',
              description: '',
              inactiveDate: null,
              phone: values.phone ? values.phone.trim() : '',
              serviceEmail: values.serviceEmail
                ? values.serviceEmail.trim()
                : '',
              configPath: '',
              address: {
                street: values.address.street
                  ? values.address.street.trim()
                  : '',
                city: values.address.city ? values.address.city.trim() : '',
                zip: values.address.zip ? values.address.zip.trim() : '',
                state: values.address.state ? values.address.state.trim() : '',
              },
              createdBy: null,
              createdDate: new Date(),
              modifiedBy: null,
              modifiedDate: new Date(),
              siteManagers: [],
              applications:
                siteApplications !== null
                  ? [...siteApplications]
                  : siteApplications,
            };
            dispatch(
              createSite({
                site: newSite,
                url: platformBaseUrl,
                token: token,
              })
            )
              .unwrap()
              .then(
                (value: any) => {
                  handleOpenAlert({
                    content: 'Site added successfully',
                    type: 'success',
                  });
                  dispatch(setSiteFormModified(false));
                  setSnackbarRouting(
                    history.push(`${path}organization/sites`, {
                      from: '/organization/addSite',
                      orgCode: orgData.orgCode,
                      orgName: orgData.orgName,
                    })
                  );
                },
                (reason: any) => {
                  handleOpenAlert({
                    content: reason.message,
                    type: 'error',
                  });
                }
              );
          }
          if (isEditSite) {
            const updatedSite: Site = {
              id: values.id ? values.id.trim() : '',
              configPath: values.configPath ? values.configPath.trim() : '',
              createdBy: null,
              createdDate: values.createdDate,
              description: values.description ? values.description.trim() : '',
              endDate: null,
              inactiveDate: values.inactiveDate,
              modifiedBy: null,
              modifiedDate: new Date(),
              orgCode: location.state.orgCode
                ? location.state.orgCode.trim()
                : '',
              phone: values.phone ? values.phone.trim() : '',
              serviceEmail: values.serviceEmail
                ? values.serviceEmail.trim()
                : '',
              siteCode: values.siteCode ? values.siteCode.trim() : '',
              siteIdentifier: values.siteIdentifier
                ? values.siteIdentifier.trim()
                : '',
              siteManagers: [],
              siteName: values.siteName.trim ? values.siteName.trim() : '',
              startDate: null,
              address: {
                city: values.address.city ? values.address.city.trim() : '',
                state: values.address.state ? values.address.state.trim() : '',
                street: values.address.street
                  ? values.address.street.trim()
                  : '',
                zip: values.address.zip ? values.address.zip.trim() : '',
              },
              applications:
                siteApplications !== null
                  ? [...siteApplications]
                  : siteApplications,
            };
            dispatch(
              updateSite({
                site: updatedSite,
                url: platformBaseUrl,
                token: token,
              })
            )
              .unwrap()
              .then(
                (value: any) => {
                  handleOpenAlert({
                    content: 'Changes were updated successfully',
                    type: 'success',
                  });
                  dispatch(setSiteFormModified(false));
                  setSnackbarRouting(
                    history.push(`${path}organization/sites`, {
                      from: '/organization/editSite',
                      orgCode: orgData.orgCode,
                      orgName: orgData.orgName,
                    })
                  );
                },
                (reason: any) => {
                  handleOpenAlert({
                    content: reason.message,
                    type: 'error',
                  });
                }
              );
          }
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
                location={
                  location.state?.from === 'dashboard' ? 'dashboard' : 'site'
                }
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
              duration={1200}
            />
            <Grid item xs={12}>
              <TitleAndCloseIcon
                breadCrumbOrigin={
                  isAddSite
                    ? `Dashboard / ${location?.state?.orgName} Organization`
                    : `Dashboard / ${location?.state?.orgName} Organization / Edit Sites `
                }
                breadCrumbTitle={isAddSite ? 'Add New Site' : site?.siteName}
                onClickButton={closeSiteForm}
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
                          {isEditSite
                            ? `Edit ${'Site'} Details`
                            : `Add New Site`}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={3}>
                        <Field name="siteName">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="Site Name"
                              id="siteName"
                              fieldName="siteName"
                              formWidth="90%"
                              required={true}
                              error={
                                form?.errors?.siteName &&
                                form?.touched?.siteName
                              }
                              helperText={
                                form?.touched?.siteName && form.errors?.siteName
                              }
                              formChangeHandler={handleChangeSiteName}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={3}>
                        <Field name="serviceEmail">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="Email"
                              id="serviceEmail"
                              fieldName="serviceEmail"
                              formWidth="90%"
                              required={true}
                              error={
                                form?.errors?.serviceEmail &&
                                form?.touched?.serviceEmail
                              }
                              helperText={
                                form?.touched?.serviceEmail &&
                                form.errors?.serviceEmail
                              }
                              formChangeHandler={handleChangeEmail}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={3}>
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
                                    dispatch(setSiteFormModified(true));
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
                                  required: true,
                                }}
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                      <Grid item xs={3}>
                        <Field name="siteCode">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="Site Code"
                              id="siteCode"
                              fieldName="siteCode"
                              formWidth="90%"
                              required={true}
                              error={
                                form?.errors?.siteCode &&
                                form?.touched?.siteCode
                              }
                              helperText={
                                form?.touched?.siteCode && form.errors?.siteCode
                              }
                              formChangeHandler={handleChangeSiteCode}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={3}>
                        <Field name="siteIdentifier">
                          {({ field, form }: { field: any; form: any }) => (
                            <InputTextWithLabel
                              field={field}
                              value={field.value}
                              label="Site Indentifier"
                              id="siteIdentifier"
                              fieldName="siteIdentifier"
                              formWidth="90%"
                              required={true}
                              error={
                                form?.errors?.siteIdentifier &&
                                form?.touched?.siteIdentifier
                              }
                              helperText={
                                form?.touched?.siteIdentifier &&
                                form.errors?.siteIdentifier
                              }
                              formChangeHandler={handleChangeSiteIndentifier}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={3}>
                        <Field name="address.street">
                          {({ field, form }: { field: any; form: any }) => {
                            return (
                              <InputTextWithLabel
                                field={field}
                                value={field.value}
                                id="address.street"
                                label="Street"
                                fieldName="street"
                                formWidth="90%"
                                formChangeHandler={handleChangeStreet}
                                required={true}
                                error={
                                  form.errors?.address?.street &&
                                  form.touched?.address?.street
                                }
                                helperText={
                                  form.touched?.address?.street &&
                                  form.errors?.address?.street
                                }
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                      <Grid item xs={3}>
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
                                formChangeHandler={handleChangeCity}
                                required={true}
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
                      <Grid item xs={3}>
                        <Field name="address.state">
                          {({ field, form }: { field: any; form: any }) => {
                            return (
                              <InputTextWithLabel
                                field={field}
                                value={field.value}
                                id="address.state"
                                label="State"
                                fieldName="state"
                                formWidth="90%"
                                formChangeHandler={handleChangeState}
                                required={true}
                                error={
                                  form.errors?.address?.state &&
                                  form.touched?.address?.state
                                }
                                helperText={
                                  form.touched?.address?.state &&
                                  form.errors?.address?.state
                                }
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                      <Grid item xs={3}>
                        <Field name="address.zip">
                          {({ field, form }: { field: any; form: any }) => {
                            return (
                              <InputTextWithLabel
                                field={field}
                                value={field.value}
                                id="address.zip"
                                label="Zip"
                                fieldName="zip"
                                formWidth="90%"
                                formChangeHandler={handleChangeZip}
                                required={true}
                                error={
                                  form.errors?.address?.zip &&
                                  form.touched?.address?.zip
                                }
                                helperText={
                                  form.touched?.address?.zip &&
                                  form.errors?.address?.zip
                                }
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <ApplicationSiteForm
                        orgCode={orgData.orgCode}
                        siteApplications={siteApplications}
                        siteApplicationsHandler={handleSiteApplicationChange}
                        disableEditApp={!adminRightsEnabled}
                      />
                    </Grid>
                  </Grid>
                </Card>
                <Grid item xs={12} my={2}>
                  <Box
                    sx={{
                      alignItems: 'flex-end',
                      display: 'flex',
                      justifyContent: isAddSite ? 'end' : 'space-between',
                      paddingX: theme.spacing(0),
                    }}
                  >
                    {isEditSite && (
                      // <Stack direction="row" spacing={2}>
                      <Box>
                        {adminRightsEnabled && (
                          <ActivateDeactivateSite
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
                        sx={{ marginRight: theme.spacing(2) }}
                        onClick={closeSiteForm}
                      >
                        BACK
                      </Button>
                      {isEditSite ? (
                        <Button
                          variant="outlined"
                          type="submit"
                          disabled={!siteFormModified}
                        >
                          UPDATE SITE
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
export default SiteForm;
