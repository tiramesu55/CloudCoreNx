/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Box, Typography, IconButton, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router-dom';
import { platformStore } from '@cloudcore/redux-store';
import {
  InputTextWithLabel,
  PhoneInput as CustomPhoneNumber,
  UnsavedData,
} from '../../components';
import { Card } from '@cloudcore/ui-shared';
import flags from 'react-phone-number-input/flags';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import { useState } from 'react';
import { withStyles } from '@mui/styles';
import { ApplicationSiteForm } from './applicationSiteForm';
import { useEffect } from 'react';
import {
  selectedId,
  createSite,
  getSiteFormModified,
  selectedSite,
  selectSelectedId,
  setSiteFormModified,
  Site,
  updateSite,
  updateSiteAdress,
  updateSiteField,
  getApplications,
} from '@cloudcore/redux-store';
import { ActivateDeactivateSite } from './activate-deactivate-site';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { Snackbar } from '@cloudcore/ui-shared';

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

export const SiteForm = () => {
  const { isMainApp, logoutSSO, postLogoutRedirectUri, platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const path = useMemo(() => {
      return `${isMainApp ? '/platform' : ''}`;
  }, [isMainApp]);  
  const { token, permissions } = useClaimsAndSignout(
    logoutSSO,
    postLogoutRedirectUri
  );

  const theme = useTheme();
  const site = useAppSelector(selectedSite);
  const selectedSiteId = useAppSelector(selectSelectedId);
  const dispatch = useAppDispatch();
  const location: any = useLocation();
  const isAddSite =
    location.state?.from === 'addSite' ||
    location.state?.from === 'organizationForm';
  const isEditSite = location.state?.from === 'editSite';
  const history = useHistory();
  const selected = useAppSelector(selectedId);
  const disableEditApp =
    permissions.admin && permissions.admin.includes('global') ? false : true;
  const [phoneLabelColor, setPhoneLabelColor] = useState('#616161');

  const [siteApplications, setSiteApplications] = useState<Application[]>(
    site.applications
  );
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');

  const [siteName, setSiteName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [sitCode, setSiteCode] = useState('');
  const [siteIdentifier, setSiteIdentifier] = useState('');
  const [state, setState] = useState('');
  const [siteNameInvalid, setSiteNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phoneNumberInValid, setPhoneNumberInValid] = useState(false);
  const [siteCodeInvalid, setSiteCodeInvalid] = useState(false);
  const [siteIdentifierInvalid, setSiteIdentifierInvalid] = useState(false);
  const [streetInvalid, setStreetInvalid] = useState(false);
  const [cityInvalid, setCityInvalid] = useState(false);
  const [stateInvalid, setStateInvalid] = useState(false);
  const [zipInvalid, setZipInvalid] = useState(false);
  const [datesInvalid, setDatesInvalid] = useState(false);
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const siteFormModified = useAppSelector(getSiteFormModified);

  useEffect(() => {
    if (platformBaseUrl) {
      dispatch(
        getApplications({
          url: platformBaseUrl,
          token: token,
        })
      );
    }
  }, [platformBaseUrl]);

  useEffect(() => {
    setSiteApplications(site.applications);
  }, [site.applications]);

  const handleSiteApplicationChange = (value: any) => {
    setSiteApplications(value);
    value.find((ele: any) => {
      if (
        ele.subscriptionStart === 'Invalid date' ||
        ele.subscriptionEnd === 'Invalid date'
      ) {
        setDatesInvalid(true);
      } else {
        setDatesInvalid(false);
      }
    });
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
    if (location.state?.from === 'organizationForm') {
      siteFormModified
        ? setDialogBoxOpen(true)
        : history.push(`${path}/organization/editOrganization`, {
            from: 'siteForm',
            orgCode: orgData.orgCode,
            orgName: orgData.orgName,
          });
    } else {
      siteFormModified
        ? setDialogBoxOpen(true)
        : history.push(`${path}/organization/sites`, {
            from: 'siteForm',
            orgCode: orgData.orgCode,
            orgName: orgData.orgName,
          });
    }
  };

  const handleChangeSiteName = (key: string, val: any) => {
    dispatch(updateSiteField({ key: key, value: val, id: selected }));
    setSiteName(val);
    val === '' ? setSiteNameInvalid(true) : setSiteNameInvalid(false);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeSiteCode = (key: string, val: any) => {
    dispatch(updateSiteField({ key: key, value: val, id: selected }));
    setSiteCode(val);
    val === '' ? setSiteCodeInvalid(true) : setSiteCodeInvalid(false);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeSiteIndentifier = (key: string, val: any) => {
    dispatch(updateSiteField({ key: key, value: val, id: selected }));
    setSiteIdentifier(val);
    val === ''
      ? setSiteIdentifierInvalid(true)
      : setSiteIdentifierInvalid(false);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeEmail = (key: string, val: any) => {
    val
      .trim()
      .match(
        /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      ? setEmailInvalid(false)
      : setEmailInvalid(true);
    setEmail(val);
    dispatch(updateSiteField({ key: key, value: val, id: selected }));
    dispatch(setSiteFormModified(true));
  };

  const handleValidate = (value: any) => {
    const isValid = isPossiblePhoneNumber(value);
    isValid ? setPhoneNumberInValid(false) : setPhoneNumberInValid(true);
    setPhone(value);
    return isValid;
  };

  const handleChangeStreet = (key: string, val: any) => {
    dispatch(updateSiteAdress({ key: key, value: val, id: selected }));
    setStreet(val);
    val === '' ? setStreetInvalid(true) : setStreetInvalid(false);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeCity = (key: string, val: any) => {
    dispatch(updateSiteAdress({ key: key, value: val, id: selected }));
    setCity(val);
    val === '' ? setCityInvalid(true) : setCityInvalid(false);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeState = (key: string, val: any) => {
    dispatch(updateSiteAdress({ key: key, value: val, id: selected }));
    setState(val);
    val === '' ? setStateInvalid(true) : setStateInvalid(false);
    dispatch(setSiteFormModified(true));
  };

  const handleChangeZip = (key: string, val: any) => {
    dispatch(updateSiteAdress({ key: key, value: val, id: selected }));
    setZip(val);
    val === '' ? setZipInvalid(true) : setZipInvalid(false);
    dispatch(setSiteFormModified(true));
  };
  /* Code to provide popup on reload of Add/edit org page */
  window.onbeforeunload = function () {
    if (isAddSite || isEditSite) {
      return 'Do you want to reload the page?';
    }
    return null;
  };

  window.history.replaceState({ from: 'siteForm' }, document.title);
  useEffect(() => {
    if (
      location.state === undefined &&
      location.pathname.includes('/organization/editSite')
    ) {
      history.push(`${path}/organization/sites`, {
        from: 'editSite',
        task: 'navigateToDashboard',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
    } else if (
      location.state === undefined &&
      location.pathname.includes(`${path}/organization/addSite`)
    ) {
      history.push(`${path}/organization/sites`, {
        from: 'addSite',
        task: 'navigateToDashboard',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
    } else if (
      location.state === undefined &&
      location.pathname.includes('/editOrg/addSite')
    ) {
      history.push(`${path}/organization/editOrganization`, {
        from: 'siteFormEdit',
        task: 'navigateToDashboard',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
    }
  }, []);
  /* End of code to provide popup on reload of Add/edit org page */

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

  const handleSubmit = (event: any) => {
    const hasError =
      document.querySelectorAll<HTMLElement>('.Mui-error').length > 0;

    if (isAddSite) {
      try {
        const newSite: {} = {
          siteCode: site.siteCode,
          siteName: site.siteName,
          siteIdentifier: site.siteIdentifier,
          orgCode: location.state.orgCode,
          description: '',
          inactiveDate: null,
          phone: site.phone,
          serviceEmail: site.serviceEmail,
          configPath: '',
          address: {
            street: site.address.street,
            city: site.address.city,
            zip: site.address.zip,
            state: site.address.state,
          },
          createdBy: null,
          createdDate: new Date(),
          modifiedBy: null,
          modifiedDate: new Date(),
          siteManagers: [],
          applications: [...siteApplications],
        };
        if (
          !hasError &&
          sitCode &&
          siteName &&
          siteIdentifier &&
          street &&
          city &&
          state &&
          zip
        ) {
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
                setSnackbar(true);
                setSnackBarMsg('addSiteSuccess');
                setSnackBarType('success');
                setTimeout(() => {
                  history.push(`${path}/organization/sites`, {
                    from: '/organization/addSite',
                    orgCode: orgData.orgCode,
                    orgName: orgData.orgName,
                  });
                }, 1000);
              },
              (reason: any) => {
                setSnackbar(true);
                setSnackBarMsg('addSiteFailure');
                setSnackBarType('failure');
              }
            );
        } else {
          event.preventDefault();
          if (sitCode === '') {
            setSiteCodeInvalid(true);
            document.getElementById('siteCode')?.focus();
          }
          if (siteName === '') {
            setSiteNameInvalid(true);
            document.getElementById('siteName')?.focus();
          }
          if (siteIdentifier === '') {
            setSiteIdentifierInvalid(true);
            document.getElementById('siteIdentifier')?.focus();
          }
          if (street === '') {
            setStreetInvalid(true);
            document.getElementById('street')?.focus();
          }
          if (city === '') {
            setCityInvalid(true);
            document.getElementById('city')?.focus();
          }
          if (state === '') {
            setStateInvalid(true);
            document.getElementById('state')?.focus();
          }
          if (zip === '') {
            setZipInvalid(true);
            document.getElementById('zip')?.focus();
          }
          if (phone === '') {
            setPhoneNumberInValid(true);
            document.getElementById('phoneInput')?.focus();
          }
          if (email === '') {
            setEmailInvalid(true);
            document.getElementById('email')?.focus();
          }
        }
      } catch (err) {
        console.log('Failed to save the site', err);
      }
    }
    if (isEditSite) {
      try {
        const updatedSite: Site = {
          id: site.id,
          configPath: site.configPath,
          createdBy: null,
          createdDate: site.createdDate,
          description: site.description,
          endDate: null,
          inactiveDate: site.inactiveDate,
          modifiedBy: null,
          modifiedDate: new Date(),
          orgCode: location.state.orgCode,
          phone: site.phone,
          serviceEmail: site.serviceEmail,
          siteCode: site.siteCode,
          siteIdentifier: site.siteIdentifier,
          siteManagers: [],
          siteName: site.siteName,
          startDate: null,
          address: {
            city: site.address.city,
            state: site.address.state,
            street: site.address.street,
            zip: site.address.zip,
          },
          applications: [...siteApplications],
        };
        if (!hasError) {
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
                setSnackbar(true);
                setSnackBarMsg('successMsg');
                setSnackBarType('success');
                setTimeout(() => {
                  history.push(`${path}/organization/sites`, {
                    from: '/organization/editSite',
                    orgCode: orgData.orgCode,
                    orgName: orgData.orgName,
                  });
                }, 1000);
              },
              (reason: any) => {
                setSnackbar(true);
                setSnackBarMsg('errorMsg');
                setSnackBarType('failure');
              }
            );
        } else {
          event.preventDefault();
        }
      } catch (err) {
        console.log('Failed to save the site', err);
      }
    }
  };

  return (
    <Grid container spacing={1}>
      <CustomCss />
      {
        <UnsavedData
          open={dialogBoxOpen}
          handleLeave={handleDialogBox}
          location={
            location.state?.from === 'organizationForm'
              ? 'organizationForm'
              : 'site'
          }
        />
      }
      {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingX: theme.spacing(3),
            paddingY: theme.spacing(1),
          }}
        >
          {isAddSite ? (
            <Typography
              variant="subtitle1"
              fontSize="18px"
              color={theme.breadcrumLink.primary}
            >
              DASHBOARD / {location?.state?.orgName.toUpperCase()} ORG / EDIT
              ORG / Add New Site
            </Typography>
          ) : (
            <Typography
              variant="subtitle1"
              fontSize="18px"
              color={theme.breadcrumLink.primary}
            >
              DASHBOARD / {location?.state?.orgName?.toUpperCase()} ORG / EDIT
              ORG / EDIT SITES /
              <Box component={'span'} sx={{ fontWeight: 'bold' }}>
                {' '}
                {site?.siteName}
              </Box>
            </Typography>
          )}
          <IconButton sx={{ color: '#000000' }} onClick={closeSiteForm}>
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
                  sx={{ alignSelf: 'self-end', textTransform: 'capitalize' }}
                >
                  <Typography
                    fontSize={theme.typography.h3.fontSize}
                    fontWeight="bold"
                    color={theme.palette.blackFont.main}
                  >
                    {isEditSite ? `Edit ${'Site'} Details` : `Add New Site`}
                  </Typography>
                </Box>
              </Grid>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Site Name"
                    id="siteName"
                    value={site['siteName']}
                    siteChangeHandler={handleChangeSiteName}
                    formWidth="90%"
                    fieldName="siteName"
                    required={true}
                    error={siteNameInvalid}
                    helperText={siteNameInvalid ? 'Site Name is Required' : ''}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Email"
                    id="email"
                    value={site['serviceEmail']}
                    siteChangeHandler={handleChangeEmail}
                    formWidth="90%"
                    fieldName="serviceEmail"
                    required={true}
                    error={emailInvalid}
                    helperText={emailInvalid ? 'Enter Valid Email' : ''}
                  />
                </Grid>
                <Grid item xs={3}>
                  <PhoneInput
                    style={{ alignItems: 'normal' }}
                    defaultCountry="US"
                    value={site.phone}
                    id="phoneInput"
                    onChange={(value: any) => {
                      if (value) {
                        const isValid = isPossiblePhoneNumber(value);
                        isValid
                          ? setPhoneNumberInValid(false)
                          : setPhoneNumberInValid(true);
                        setPhone(value);
                      }
                      if (value === undefined) {
                        dispatch(
                          updateSiteField({
                            key: 'phone',
                            value: '',
                            id: selected,
                          })
                        );
                      } else {
                        dispatch(
                          updateSiteField({
                            key: 'phone',
                            value: value,
                            id: selected,
                          })
                        );
                        dispatch(setSiteFormModified(true));
                      }
                    }}
                    inputComponent={CustomPhoneNumber}
                    onFocus={() =>
                      setPhoneLabelColor(theme.palette.primary.main)
                    }
                    onBlur={() => setPhoneLabelColor('#616161')}
                    flags={flags}
                    rules={{
                      validate: (phone: any) => handleValidate(phone),
                    }}
                    inputProps={{
                      error: phoneNumberInValid.toString(),
                      label: 'Enter valid phone number',
                      name: 'Phone',
                      width: '81.5%',
                      required: true,
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Site Code"
                    id="siteCode"
                    value={site['siteCode']}
                    siteChangeHandler={handleChangeSiteCode}
                    formWidth="90%"
                    fieldName="siteCode"
                    required={true}
                    error={siteCodeInvalid}
                    helperText={siteCodeInvalid ? 'Site Code is Required' : ''}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Site Indentifier"
                    id="siteIdentifier"
                    value={site['siteIdentifier']}
                    siteChangeHandler={handleChangeSiteIndentifier}
                    formWidth="90%"
                    fieldName="siteIdentifier"
                    required={true}
                    error={siteIdentifierInvalid}
                    helperText={
                      siteIdentifierInvalid
                        ? 'Site Indentifier is Required'
                        : ''
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Street"
                    id="street"
                    value={site['address'].street}
                    formWidth="90%"
                    fieldName="street"
                    siteChangeHandler={handleChangeStreet}
                    required={true}
                    error={streetInvalid}
                    helperText={streetInvalid ? 'Street is Required' : ''}
                  />
                </Grid>
                {/* </Grid> */}
                {/* <Grid container item xs={12} mt={2}> */}
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="City"
                    id="city"
                    value={site['address'].city}
                    formWidth="90%"
                    fieldName="city"
                    siteChangeHandler={handleChangeCity}
                    required={true}
                    error={cityInvalid}
                    helperText={cityInvalid ? 'City is Required' : ''}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="State/Prov "
                    id="state"
                    value={
                      site['address'].state === null
                        ? ''
                        : site['address'].state
                    }
                    formWidth="90%"
                    fieldName="state"
                    siteChangeHandler={handleChangeState}
                    required={true}
                    error={stateInvalid}
                    helperText={stateInvalid ? 'State is Required' : ''}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputTextWithLabel
                    label="Zip/Postal"
                    id="zip"
                    formWidth="90%"
                    fieldName="zip"
                    value={site['address'].zip}
                    siteChangeHandler={handleChangeZip}
                    required={true}
                    error={zipInvalid}
                    helperText={zipInvalid ? 'Zip is Required' : ''}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <ApplicationSiteForm
                  siteApplications={siteApplications}
                  siteApplicationsHandler={handleSiteApplicationChange}
                  disableEditApp={disableEditApp}
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
                <Box>
                  <ActivateDeactivateSite
                    setSnackbar={handleSnackbar}
                    setSnackBarType={handleSnackbarType}
                    setSnackBarMsg={handleSnackbarMsg}
                    orgData={orgData}
                    disableEditApp={disableEditApp}
                  />
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
                    onClick={handleSubmit}
                    disabled={!siteFormModified}
                  >
                    UPDATE SITE
                  </Button>
                ) : (
                  <Button variant="outlined" onClick={handleSubmit}>
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
