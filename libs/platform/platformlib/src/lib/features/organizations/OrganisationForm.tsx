/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  Autocomplete,
  useTheme,
} from '@mui/material';
import { useEffect, useState, useContext, useMemo } from 'react';
import {
  InputTextWithLabel,
  PhoneInput as CustomPhoneNumber,
  UnsavedData,
} from '../../components';
import {
  InfoCard,
  Card,
  Snackbar,
  sites_img,
  users_img,
  location_img,
} from '@cloudcore/ui-shared';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import {
  createOrganizationAsync,
  organizationSelector,
  updateField,
  selectedOrganization,
  selectedId,
  updateAdress,
  Organization,
  resetOrganization,
  setOrganization,
  updateOrganizationAsync,
  getOrganizationStatsAsync,
  organizationStats,
  getAllOrganizationsDomains,
  allOrgDomains,
  selectOrgByOrgCode,
  getOrgFormModified,
  setOrgFormModified,
  fetchUsers,
  usersDomain,
  resetSite,
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
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import TitleAndCloseIcon from '../../components/TitleAndClose/TitleAndClose';

const { useAppDispatch, useAppSelector } = platformStore;
const CustomCss = withStyles(() => ({
  '@global': {
    '.PhoneInputCountry': {
      alignItems: 'normal',
      marginTop: '32px',
    },
  },
}))(() => null);

export const OrganizationForm = () => {
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const theme = useTheme();
  const organization = useAppSelector(selectedOrganization);
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const selected = useAppSelector(selectedId);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location: any = useLocation();
  const [orgDomain, setOrgDomain] = useState('');
  const [orgCodeInvalid, setOrgCodeInvalid] = useState(false);
  const [orgNameInvalid, setOrgNameInvalid] = useState(false);
  const [orgDescriptionInvalid, setOrgDescriptionInvalid] = useState(false);
  const [phoneNumberInValid, setPhoneNumberInValid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [orgDomainInvalid, setOrgDomainInvalid] = useState(false);
  const [streetInvalid, setStreetInvalid] = useState(false);
  const [cityInvalid, setCityInvalid] = useState(false);
  const [stateInvalid, setStateInvalid] = useState(false);
  const [zipInvalid, setZipInvalid] = useState(false);
  const selectOrgByID = useSelector((state: any) =>
    organizationSelector.selectById(state, selected)
  );
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const selectedOrgStats = useAppSelector(organizationStats);
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const orgFormModified = useAppSelector(getOrgFormModified);
  const allOrganizationDomains = useAppSelector(allOrgDomains);
  const usedDomains = useAppSelector(usersDomain);
  const [orgDomainDialogOpen, setOrgDomainDialogOpen] = useState(false);
  const [orgDomainList, setOrgDomainList] = useState<string[]>([]);

  const isAddOrganization = location.state?.from === 'addOrganization';
  const isEditOrganization =
    location.state?.from === 'editOrganization' ||
    location.state?.from === 'siteForm';

  const isEditOrganizationRedirect = location.state?.from === 'siteFormEdit';

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
            setSnackbar(true);
            setSnackBarMsg('fetchError');
            setSnackBarType('failure');
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
          setSnackbar(true);
          setSnackBarMsg('fetchError');
          setSnackBarType('failure');
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
            setSnackbar(true);
            setSnackBarMsg('fetchError');
            setSnackBarType('failure');
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
            setSnackbar(true);
            setSnackBarMsg('fetchError');
            setSnackBarType('failure');
          }
        );
    }
  }, []);

  const validOrgCode =
    organization.orgCode === null || organization.orgCode === '' ? false : true;
  const validOrgName =
    organization.name === null || organization.name === '' ? false : true;
  const validDescription =
    organization.description === null || organization.description === ''
      ? false
      : true;
  const validEmail = organization?.officeEmail
    ?.trim()
    .match(
      /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    ? true
    : false;
  const validDomain = orgDomainList.length > 0 ? true : false;
  const validPhone =
    organization.officePhone === null || organization.officePhone === ''
      ? false
      : true;
  const validStreet =
    organization.address['street'] === null ||
    organization.address['street'] === ''
      ? false
      : true;
  const validCity =
    organization.address['city'] === null || organization.address['city'] === ''
      ? false
      : true;
  const validState =
    organization.address['state'] === null ||
    organization.address['state'] === ''
      ? false
      : true;
  const validZipCode =
    organization.address['zip'] === null || organization.address['zip'] === ''
      ? false
      : true;

  // orgDomain handlers
  const handleOrgDomainDialog = (value: boolean) => {
    setOrgDomainDialogOpen(value);
  };

  const onOrgDomainAdd = (value: string) => {
    setOrgDomainList([...orgDomainList, value]);
    dispatch(setOrgFormModified(true));
  };

  const onOrgDomainDelete = (id: number) => {
    const updatedOrgDomainList =
      orgDomainList !== null
        ? orgDomainList.filter((ele: any, indx: any) => {
            return indx !== id;
          })
        : [];
    setOrgDomainList(updatedOrgDomainList);
    dispatch(setOrgFormModified(true));
  };

  //orgDomain handlers

  const handleOrgCodeChange = (key: string, event: any) => {
    event ? setOrgCodeInvalid(false) : setOrgCodeInvalid(true);
    dispatch(updateField({ value: event, key, id: selected }));
    dispatch(setOrgFormModified(true));
  };

  const onOrgCodeFocused = (e: any) => {
    e.value ? setOrgCodeInvalid(false) : setOrgCodeInvalid(true);
  };

  const handleOrgNameChange = (key: string, event: any) => {
    event ? setOrgNameInvalid(false) : setOrgNameInvalid(true);
    dispatch(updateField({ value: event, key, id: selected }));
    dispatch(setOrgFormModified(true));
  };

  const onOrgNameFocused = (e: any) => {
    e.value ? setOrgNameInvalid(false) : setOrgNameInvalid(true);
  };

  const handleOrgDescriptionChange = (key: string, event: any) => {
    event ? setOrgDescriptionInvalid(false) : setOrgDescriptionInvalid(true);
    dispatch(updateField({ value: event, key, id: selected }));
    dispatch(setOrgFormModified(true));
  };

  const onOrgDescriptionFocused = (e: any) => {
    e.value ? setOrgDescriptionInvalid(false) : setOrgDescriptionInvalid(true);
  };

  const handleValidate = (value: any) => {
    const isValid = isPossiblePhoneNumber(value);
    isValid ? setPhoneNumberInValid(false) : setPhoneNumberInValid(true);
    return isValid;
  };

  /* Code to provide popup on reload of Add/edit org page */
  window.onbeforeunload = function () {
    if (isAddOrganization || isEditOrganization || isEditOrganizationRedirect) {
      return 'Do you want to reload the page?';
    }
    return null;
  };

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

  const handleOfficeEmailChange = (key: string, event: any) => {
    event
      .trim()
      .match(
        /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      ? setEmailInvalid(false)
      : setEmailInvalid(true);
    dispatch(updateField({ value: event, key, id: selected }));
    dispatch(setOrgFormModified(true));
  };

  const onEmailFocused = (e: any) => {
    String(e)
      .trim()
      .match(
        /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      ? setEmailInvalid(false)
      : setEmailInvalid(true);
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

  const handleChangeStreet = (key: string, val: any) => {
    val ? setStreetInvalid(false) : setStreetInvalid(true);
    dispatch(updateAdress({ key: key, value: val, id: selected }));
    dispatch(setOrgFormModified(true));
  };

  const onStreetFocused = (e: any) => {
    e.value ? setStreetInvalid(false) : setStreetInvalid(true);
  };

  const handleChangeCity = (key: string, val: any) => {
    val ? setCityInvalid(false) : setCityInvalid(true);
    dispatch(updateAdress({ key: key, value: val, id: selected }));
    dispatch(setOrgFormModified(true));
  };

  const onCityFocused = (e: any) => {
    e.value ? setCityInvalid(false) : setCityInvalid(true);
  };

  const handleChangeState = (key: string, val: any) => {
    val ? setStateInvalid(false) : setStateInvalid(true);
    dispatch(updateAdress({ key: key, value: val, id: selected }));
    dispatch(setOrgFormModified(true));
  };

  const onStateFocused = (e: any) => {
    e.value ? setStateInvalid(false) : setStateInvalid(true);
  };

  const handleChangeZip = (key: string, val: any) => {
    val ? setZipInvalid(false) : setZipInvalid(true);
    dispatch(updateAdress({ key: key, value: val, id: selected }));
    dispatch(setOrgFormModified(true));
  };

  const onZipFocused = (e: any) => {
    e.value ? setZipInvalid(false) : setZipInvalid(true);
  };

  const handleSubmit = (event: any) => {
    if (isAddOrganization) {
      try {
        const newOrganization: Organization = {
          name: organization.name,
          id: organization.orgCode,
          description: organization.description,
          orgCode: organization.orgCode,
          address: {
            street: organization.address.street,
            city: organization.address.city,
            state: organization.address.state,
            zip: organization.address.zip,
          },
          orgDomains: [...orgDomainList],
          root: organization.root,
          orgAdmins: [],
          officeEmail: organization.officeEmail,
          officePhone: organization.officePhone,
          createdDate: new Date(),
          modifiedDate: new Date(),
          createdBy: null,
          modifiedBy: null,
          childOrgs: [],
        };
        if (
          !orgCodeInvalid &&
          !orgNameInvalid &&
          !orgDescriptionInvalid &&
          !streetInvalid &&
          !cityInvalid &&
          !stateInvalid &&
          !zipInvalid &&
          validOrgCode &&
          validOrgName &&
          validDescription &&
          validEmail &&
          validDomain &&
          validPhone &&
          validStreet &&
          validCity &&
          validState &&
          validZipCode
        ) {
          dispatch(createOrganizationAsync(newOrganization))
            .unwrap()
            .then(
              () => {
                setSnackbar(true);
                setSnackBarMsg('addOrganizationSuccess');
                setSnackBarType('success');
                setTimeout(() => {
                  history.push(path);
                }, 1000);
              },
              () => {
                setSnackbar(true);
                setSnackBarMsg('addOrganizationFailure');
                setSnackBarType('failure');
              }
            );
        } else {
          event.preventDefault();
          if (
            organization.orgCode === null ||
            organization.orgCode.trim() === ''
          ) {
            setOrgCodeInvalid(true);
            document.getElementById('orgCode')?.focus();
          }
          if (organization.name === null || organization.name.trim() === '') {
            setOrgNameInvalid(true);
            document.getElementById('organizationName')?.focus();
          }
          if (
            organization.description === null ||
            organization.description?.trim() === ''
          ) {
            setOrgDescriptionInvalid(true);
            document.getElementById('description')?.focus();
          }
          if (
            organization.officePhone === null ||
            organization.officePhone?.trim() === ''
          ) {
            setPhoneNumberInValid(true);
            document.getElementById('officePhone')?.focus();
          }
          if (validEmail === false) {
            setEmailInvalid(true);
            document.getElementById('officeEmail')?.focus();
          }
          if (validDomain !== true) {
            setOrgDomainInvalid(true);
            document.getElementById('orgDomains')?.focus();
          }
          if (
            organization.address['street'] === null ||
            organization.address['street'] === ''
          ) {
            setStreetInvalid(true);
            document.getElementById('street')?.focus();
          }
          if (
            organization.address['city'] === null ||
            organization.address['city'] === ''
          ) {
            setCityInvalid(true);
            document.getElementById('city')?.focus();
          }
          if (
            organization.address['state'] === null ||
            organization.address['state'] === ''
          ) {
            setStateInvalid(true);
            document.getElementById('State/Prov')?.focus();
          }
          if (
            organization.address['zip'] === null ||
            organization.address['zip'] === ''
          ) {
            setZipInvalid(true);
            document.getElementById('Zip/Postal')?.focus();
          }
        }
      } catch (err) {
        console.log('Failed to save the Organization', err);
      }
    }
    if (isEditOrganization || isEditOrganizationRedirect) {
      try {
        const updatedOrganization: Organization = {
          name: organization.name,
          id: organization.orgCode,
          description: organization.description,
          orgCode: organization.orgCode,
          address: {
            street: organization.address.street,
            city: organization.address.city,
            state: organization.address.state,
            zip: organization.address.zip,
          },
          orgDomains: [...orgDomainList],
          root: organization.root,
          orgAdmins: [],
          inactiveDate: organization.inactiveDate,
          officeEmail: organization.officeEmail,
          officePhone: organization.officePhone,
          createdDate: new Date(),
          modifiedDate: new Date(),
          createdBy: null,
          modifiedBy: null,
          childOrgs: [],
        };
        if (
          !orgCodeInvalid &&
          !orgNameInvalid &&
          !orgDescriptionInvalid &&
          !phoneNumberInValid &&
          !streetInvalid &&
          !cityInvalid &&
          !stateInvalid &&
          !zipInvalid &&
          validOrgCode &&
          validOrgName &&
          validDescription &&
          validEmail &&
          validDomain &&
          validPhone &&
          validStreet &&
          validCity &&
          validState &&
          validZipCode
        ) {
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
                setSnackbar(true);
                setSnackBarMsg('successMsg');
                setSnackBarType('success');
                setTimeout(() => {
                  history.push(path);
                }, 1000);
              },
              () => {
                setSnackbar(true);
                setSnackBarMsg('errorMsg');
                setSnackBarType('failure');
              }
            );
        } else {
          event.preventDefault();
          if (
            organization.orgCode === null ||
            organization.orgCode.trim() === ''
          ) {
            setOrgCodeInvalid(true);
            document.getElementById('orgCode')?.focus();
          }
          if (organization.name === null || organization.name.trim() === '') {
            setOrgNameInvalid(true);
            document.getElementById('organizationName')?.focus();
          }
          if (
            organization.description === null ||
            organization.description?.trim() === ''
          ) {
            setOrgDescriptionInvalid(true);
            document.getElementById('description')?.focus();
          }
          if (
            organization.officePhone === null ||
            organization.officePhone?.trim() === ''
          ) {
            setPhoneNumberInValid(true);
            document.getElementById('officePhone')?.focus();
          }
          if (validEmail === false) {
            setEmailInvalid(true);
            document.getElementById('officeEmail')?.focus();
          }
          if (validDomain !== true) {
            setOrgDomainInvalid(true);
            document.getElementById('orgDomains')?.focus();
          }
          if (
            organization.address['street'] === null ||
            organization.address['street'] === ''
          ) {
            setStreetInvalid(true);
            document.getElementById('street')?.focus();
          }
          if (
            organization.address['city'] === null ||
            organization.address['city'] === ''
          ) {
            setCityInvalid(true);
            document.getElementById('city')?.focus();
          }
          if (
            organization.address['state'] === null ||
            organization.address['state'] === ''
          ) {
            setStateInvalid(true);
            document.getElementById('State/Prov')?.focus();
          }
          if (
            organization.address['zip'] === null ||
            organization.address['zip'] === ''
          ) {
            setZipInvalid(true);
            document.getElementById('Zip/Postal')?.focus();
          }
        }
      } catch (err) {
        console.log('Failed to save the organization', err);
      }
    }
  };

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
    <Grid container spacing={1}>
      <CustomCss />
      {
        <UnsavedData
          open={dialogBoxOpen}
          handleLeave={handleDialogBox}
          location="organization"
        />
      }
      {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
      {
        <OrgDomainModal
          open={orgDomainDialogOpen}
          handleDialog={handleOrgDomainDialog}
          orgDomains={orgDomainList}
          addOrgDomain={onOrgDomainAdd}
          deleteOrgDomain={onOrgDomainDelete}
          allOrganizationDomain={allOrganizationDomains}
          usedDomains={usedDomains}
        />
      }
      <Grid xs={12} item>
        <Box>
          <TitleAndCloseIcon
            onClickButton={closeOrganizationForm}
            breadCrumbOrigin={
              isAddOrganization
                ? 'ADD NEW ORGANIZATIONS'
                : `Dashboard / ${organization['name']?.toUpperCase()}`
            }
            breadCrumbTitle={isAddOrganization ? '' : 'EDIT ORG'}
            addBtn={!isAddOrganization}
            onClickAddBtn={addNewSite}
            addBtnText="Add New Site"
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
                  <InputTextWithLabel
                    label="Organization Code"
                    id="orgCode"
                    value={organization['orgCode']}
                    formWidth="90%"
                    fieldName="orgCode"
                    orgChangeHandler={handleOrgCodeChange}
                    error={orgCodeInvalid}
                    required={true}
                    helperText={
                      orgCodeInvalid ? 'Organization Code is Required' : ''
                    }
                    focusHandler={onOrgCodeFocused}
                    disabled={isEditOrganization ? true : false}
                  />
                </Grid>
                <Grid xs={3} item>
                  <InputTextWithLabel
                    label="Organization Name"
                    id="organizationName"
                    value={organization['name']}
                    formWidth="90%"
                    fieldName="name"
                    orgChangeHandler={handleOrgNameChange}
                    error={orgNameInvalid}
                    required={true}
                    helperText={
                      orgNameInvalid ? 'Organization Name is Required' : ''
                    }
                    focusHandler={onOrgNameFocused}
                  />
                </Grid>
                <Grid xs={3} item>
                  <InputTextWithLabel
                    label="Description"
                    id="description"
                    value={organization['description']}
                    formWidth="90%"
                    fieldName="description"
                    orgChangeHandler={handleOrgDescriptionChange}
                    error={orgDescriptionInvalid}
                    required={true}
                    helperText={
                      orgDescriptionInvalid
                        ? 'Organization Description is Required'
                        : ''
                    }
                    focusHandler={onOrgDescriptionFocused}
                  />
                </Grid>
                <Grid xs={3} item>
                  <Autocomplete
                    multiple
                    id="OrgDomains"
                    options={orgDomainList}
                    limitTags={1}
                    value={[...orgDomainList]}
                    size="small"
                    sx={{ width: '93%' }}
                    readOnly
                    freeSolo
                    renderInput={(params) => (
                      <Box sx={{ display: 'flex' }}>
                        <InputTextWithLabel
                          params={{ ...params }}
                          fieldName={'orgDomain'}
                          label="Org Domains"
                          formWidth="90%"
                          required={true}
                          error={
                            orgDomainInvalid && orgDomainList.length <= 0
                              ? true
                              : false
                          }
                          helperText={
                            orgDomainInvalid && orgDomainList.length <= 0
                              ? 'Atleast one domain required'
                              : ''
                          }
                        />
                        <Button
                          size="small"
                          onClick={() => handleOrgDomainDialog(true)}
                          sx={{ height: '45px', marginTop: '20px' }}
                        >
                          {isAddOrganization ? 'Add' : 'Edit'}
                        </Button>
                      </Box>
                    )}
                  />
                </Grid>
                <Grid xs={3} item>
                  <InputTextWithLabel
                    label="Office Email"
                    id="officeEmail"
                    value={
                      organization['officeEmail'] === null
                        ? ''
                        : organization['officeEmail']
                    }
                    formWidth="90%"
                    fieldName="officeEmail"
                    orgChangeHandler={handleOfficeEmailChange}
                    required={true}
                    error={emailInvalid}
                    helperText={
                      emailInvalid && organization.officeEmail === ''
                        ? 'Email is Required'
                        : emailInvalid
                        ? 'Invalid Email'
                        : ''
                    }
                    focusHandler={onEmailFocused}
                  />
                </Grid>
                <Grid xs={3} item>
                  <PhoneInput
                    style={{ alignItems: 'normal' }}
                    defaultCountry="US"
                    id="officePhone"
                    value={organization.officePhone}
                    onChange={(value: any) => {
                      if (value) {
                        const isValid = isPossiblePhoneNumber(value);
                        isValid
                          ? setPhoneNumberInValid(false)
                          : setPhoneNumberInValid(true);
                      }
                      if (value === undefined) {
                        dispatch(
                          updateField({
                            key: 'officePhone',
                            value: '',
                            id: selected,
                          })
                        );
                      } else {
                        dispatch(
                          updateField({
                            key: 'officePhone',
                            value: value,
                            id: selected,
                          })
                        );
                        dispatch(setOrgFormModified(true));
                      }
                    }}
                    onFocus={() => {
                      const isValid = isPossiblePhoneNumber(
                        organization.officePhone
                      );
                      isValid
                        ? setPhoneNumberInValid(false)
                        : setPhoneNumberInValid(true);
                    }}
                    inputComponent={CustomPhoneNumber}
                    flags={flags}
                    rules={{
                      validate: (phone: any) => handleValidate(phone),
                    }}
                    inputProps={{
                      error: phoneNumberInValid.toString(),
                      label:
                        organization?.officePhone === '' ||
                        organization?.officePhone === null
                          ? 'Phone Number is Required '
                          : 'Enter valid phone number',
                      width: '81.5%',
                      name: 'Phone',
                      required: true,
                    }}
                  />
                </Grid>
                <Grid xs={3} item>
                  <InputTextWithLabel
                    label="Street"
                    id="street"
                    value={organization['address']?.street}
                    formWidth="90%"
                    fieldName="street"
                    orgChangeHandler={handleChangeStreet}
                    error={streetInvalid}
                    required={true}
                    helperText={streetInvalid ? 'Street is Required' : ''}
                    focusHandler={onStreetFocused}
                  />
                </Grid>
                <Grid xs={3} item>
                  <InputTextWithLabel
                    label="City"
                    id="city"
                    value={organization['address']?.city}
                    formWidth="90%"
                    fieldName="city"
                    orgChangeHandler={handleChangeCity}
                    error={cityInvalid}
                    required={true}
                    helperText={cityInvalid ? 'City is Required' : ''}
                    focusHandler={onCityFocused}
                  />
                </Grid>
                <Grid xs={3} item>
                  <InputTextWithLabel
                    label="State/Prov"
                    id="State/Prov"
                    value={
                      organization['address']?.state === null
                        ? ''
                        : organization['address']?.state
                    }
                    formWidth="90%"
                    fieldName="state"
                    orgChangeHandler={handleChangeState}
                    error={stateInvalid}
                    required={true}
                    helperText={stateInvalid ? 'State is Required' : ''}
                    focusHandler={onStateFocused}
                  />
                </Grid>
                <Grid xs={3} item>
                  <InputTextWithLabel
                    label="Zip/Postal"
                    id="Zip/Postal"
                    value={organization['address']?.zip}
                    formWidth="90%"
                    fieldName="zip"
                    orgChangeHandler={handleChangeZip}
                    error={zipInvalid}
                    required={true}
                    helperText={zipInvalid ? 'Zip is Required' : ''}
                    focusHandler={onZipFocused}
                  />
                </Grid>
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
              <Grid xs={12} item sx={{ paddingBottom: theme.spacing(3.7) }}>
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
              <ActivateDeactivateOrg
                orgDomain={orgDomain}
                setSnackbar={handleSnackbar}
                setSnackBarType={handleSnackbarType}
                setSnackBarMsg={handleSnackbarMsg}
              />
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
                onClick={handleSubmit}
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
                onClick={handleSubmit}
                disabled={!orgFormModified}
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
  );
};
