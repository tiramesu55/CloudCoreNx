import { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  IconButton,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Card, Snackbar } from '@cloudcore/ui-shared';
import { useHistory } from 'react-router-dom';
import InputSelectWithLabel from '../../components/InputSelectWithLabel/InputSelectWithLabel';
import { InputTextWithLabel } from '../../components/input-text-with-label/input-text-with-label';
import {
  Organization,
  selectOrganizations,
  organizationList,
  setOrganization,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import {
  deleteSuiteAsync,
  getSuitesAsync,
  getWorkspaceIDByDomainAsync,
  getSuiteByPermission,
  permissionsList,
  selectedSuite,
  getSuiteFormModified,
  setSuiteFormModified,
  resetForm,
  setResetForm,
  selectedReports,
  updateSuiteAsync,
  getWorkspaceId,
  updateWorkSpaceIdByDomainAsync,
  getAvailableReportsAsync,
  availableReports,
} from '@cloudcore/redux-store';
import DeleteSuite from './deleteSuite';
import { UnsavedData } from '../../components/un-saved-data/un-saved-data';
import { platformStore } from '@cloudcore/redux-store';

interface ReportState {
  value: string;
  label: string;
  checked: boolean;
}

const { useAppDispatch, useAppSelector } = platformStore;

const CustomReports = () => {
  const history = useHistory();
  const theme = useTheme();
  const orgList = useAppSelector(organizationList);
  const permList = useAppSelector(permissionsList);
  const avalReports = useAppSelector(availableReports);
  const dispatch = useAppDispatch();
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<string>('');
  const [resetDomain, setResetDomain] = useState(false);
  const [resetPermission, setResetPermission] = useState(false);
  const currentWorkspaceId = useAppSelector((state: any) =>
    getWorkspaceId(state, selectedDomain)
  );
  const currentSuite = useAppSelector((state: any) =>
    selectedSuite(state, selectedPermission)
  );

  const currentReports = useAppSelector((state: any) =>
    selectedReports(state, selectedPermission)
  );
  const updatedSuite = useAppSelector((state: any) =>
    getSuiteByPermission(state, selectedPermission)
  );
  const updatedSuiteInfo = structuredClone(updatedSuite);
  const closeCustomReport = () => {
    suiteFormModified ? setUnsavedDialogBoxOpen(true) : history.goBack();
  };
  const changeCustomReportSelection = () => {
    if (suiteFormModified) {
      setUnsavedDialogBoxOpen(true);
    }
  };
  const enableWorkSpaceIdTextField = () => {
    setIsWorkSpaceIdDisabled(false);
  };
  const disableWorkSpaceIdTextField = () => {
    dispatch(
      updateWorkSpaceIdByDomainAsync({
        token,
        url: platformBaseUrl,
        data: {
          domain: selectedDomain,
          workspaceId: workspaceId,
        },
      })
    );
    setIsWorkSpaceIdDisabled(true);
  };
  const resetDomainHandler = (flag: boolean) => {
    setResetDomain(flag);
  };
  const resetPermisssionHandler = (flag: boolean) => {
    setResetPermission(flag);
  };
  const [isWorkSpaceIdDisabled, setIsWorkSpaceIdDisabled] = useState(true);
  const [isDomainDisabled, setIsDomainDisabled] = useState(true);
  const [selectedOrgName, setSelectedOrgName] = useState<string>('');
  const [orgDomainList, setOrgDomainList] = useState<string[]>([]);
  const organizations = useAppSelector(selectOrganizations);
  const suiteFormModified = useAppSelector(getSuiteFormModified);
  const resetFormIndicator = useAppSelector(resetForm);

  const availableDashboard: ReportState[] = avalReports.map((rep: any) => {
    return {
      value: rep.ReportId,
      label: rep.ReportName,
      checked: false,
    };
  });

  const addedToSuiteSample: ReportState[] = [];

  const [addToSuite, setAddToSuite] = useState(addedToSuiteSample);
  const [addedToSuite, setAddedToSuite] = useState(addedToSuiteSample);
  const [availableDash, setAvailableDash] = useState<ReportState[]>([]);
  const [availableDashUpdated, setAvailableDashUpadted] = useState(false);
  const [disableAddToSuite, setDisableAddToSuite] = useState(true);
  const [disableRemoveFromSuite, setDisableRemoveFromSuite] = useState(true);
  const [removeFromSuite, setRemoveFromSuite] = useState([]) as any;
  const [removedFromSuite, setRemovedFromSuite] = useState([]) as any;
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState('');
  const [suiteNameInvalid, setSuiteNameInvalid] = useState(false);
  const [disableDeleteSuite, setDisableDeleteSuite] = useState(true);

  const updateCustomReport = () => {
    if (updatedSuiteInfo) {
      updatedSuiteInfo.name = suiteName;
      updatedSuiteInfo.reports = addedToSuite.map((report) => {
        return { reportId: report.value, reportName: report.label };
      });
    }
    if (selectedPermission && suiteName) {
      dispatch(
        updateSuiteAsync({
          token,
          url: platformBaseUrl,
          suite: updatedSuiteInfo,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            setSnackbar(true);
            setSnackBarMsg('updateSuiteSuccess');
            setSnackBarType('success');
            dispatch(setSuiteFormModified(false));
            dispatch(setResetForm(true));
            setAvailableDashUpadted(false);
            setAddToSuite([]);
          },
          (reason: any) => {
            setSnackbar(true);
            setSnackBarMsg('updateSuiteFailure');
            setSnackBarType('failure');
          }
        );
    } else if (suiteName === '') {
      setSuiteNameInvalid(true);
      document.getElementById('suiteName')?.focus();
    }
  };

  const handleOrgCodeChange = (event: any) => {
    setIsDomainDisabled(false);
    const selectedOrganization = organizations
      ? organizations.filter((org: Organization) => {
          return org?.name === event;
        })
      : [];
    if (selectedOrganization[0]) {
      setSelectedOrgName(selectedOrganization[0].name);
      setOrgDomainList(selectedOrganization[0].orgDomains);
    }
    setSelectedDomain('');
    setSelectedPermission('');
    setIsWorkSpaceIdDisabled(true);
    if (availableDashUpdated) {
      setAvailableDash(availableDashboard);
      setAvailableDashUpadted(false);
    }
  };

  const handleDomainChange = (event: any) => {
    setSelectedDomain(event);
    setIsDomainDisabled(false);
    setSelectedPermission('');
    // setAvailableDash(availableDashboard);
  };

  const handlePermissionChange = (event: any) => {
    setSelectedPermission(event);
    setDisableDeleteSuite(false);
    if (currentSuite && currentSuite.name !== '') {
      setSuiteName(currentSuite.name);
    }
  };

  const [unSavedDialogBoxOpen, setUnsavedDialogBoxOpen] = useState(false);

  const [suiteName, setSuiteName] = useState('');
  const [suiteId, setSuiteId] = useState('');
  const handleDialogBox = (open: boolean) => {
    setDialogBoxOpen(open);
  };

  const handleUnSavedDialogBox = (open: boolean) => {
    setUnsavedDialogBoxOpen(open);
  };

  const suiteChangeHandler = (event: any) => {
    setSuiteName(event.trim());
    // setFormEdited(true);
    dispatch(setSuiteFormModified(true));
  };

  const workspaceIdChangeHandler = (event: any) => {
    setWorkspaceId(event.trim());
    // setFormEdited(true);
    dispatch(setSuiteFormModified(true));
    event.trim() ? setDisableDeleteSuite(false) : setDisableDeleteSuite(true);
  };

  const onSuiteNameFocused = (ele: HTMLInputElement) => {
    ele.value !== '' ? setSuiteNameInvalid(false) : setSuiteNameInvalid(true);
  };

  const reportsAddToSuite = (e: any) => {
    setAddedToSuite([...addedToSuite, ...addToSuite]);
    addToSuite.forEach((el: any) => {
      setAvailableDash((prev: any) =>
        prev.filter((x: any) => x.value !== el.value)
      );
    });
    setAddToSuite([]);
    dispatch(setSuiteFormModified(true));
    if (!availableDashUpdated) {
      setAvailableDashUpadted(true);
    }
  };

  const removeReports = (e: any) => {
    setRemovedFromSuite([...removeFromSuite]);
    removeFromSuite.forEach((el: any) => {
      setAddedToSuite((prev: any) =>
        prev.filter((x: any) => x.value !== el.value)
      );
    });
    const updatedAvailableDashboard = removeFromSuite.map((item: any) => {
      return { ...item, checked: false };
    });
    setAvailableDash([...availableDash, ...updatedAvailableDashboard]);
    setRemoveFromSuite([]);
    dispatch(setSuiteFormModified(true));
    if (!availableDashUpdated) {
      setAvailableDashUpadted(true);
    }
  };

  const handleChange = (e: any, val: string, label: string) => {
    const updatedAvailableDash: ReportState[] = availableDash.map(
      (report: ReportState) => {
        if (report.value === val) {
          return { ...report, checked: !report.checked };
        } else {
          return { ...report };
        }
      }
    );
    setAvailableDash([...updatedAvailableDash]);
    const { checked } = e.target;
    if (checked) {
      setAddToSuite((prev: ReportState[]) => [
        ...prev,
        { value: val, label: label, checked: false },
      ]) as any;
      e.target.checked = true;
      setDisableAddToSuite(false);
    } else {
      setAddToSuite((prev: ReportState[]) =>
        prev.filter((report: ReportState) => report.value !== val)
      );
    }
  };

  const handleChangeAddedToSuite = (e: any, val: string, label: string) => {
    const updatedSetAddedToSuite: ReportState[] = addedToSuite.map(
      (report: ReportState) => {
        if (report.value === val) {
          return { ...report, checked: !report.checked };
        } else {
          return { ...report };
        }
      }
    );
    setAddedToSuite([...updatedSetAddedToSuite]);

    const { checked } = e.target;
    if (checked) {
      setRemoveFromSuite((prev: ReportState[]) => [
        ...prev,
        { value: val, label: label, checked: false },
      ]) as any;
    } else {
      setRemoveFromSuite((prev: ReportState[]) =>
        prev.filter((report: ReportState) => report.value !== val)
      );
    }
  };

  useEffect(() => {
    if (token && selectedDomain !== '') {
      dispatch(
        getSuitesAsync({
          token,
          url: platformBaseUrl,
          domain: selectedDomain,
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
        getWorkspaceIDByDomainAsync({
          token,
          url: platformBaseUrl,
          domain: selectedDomain,
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
  }, [dispatch, token, platformBaseUrl, selectedDomain]);

  useEffect(() => {
    if (availableDash.some((item) => item.checked === true)) {
      setDisableAddToSuite(false);
    } else {
      setDisableAddToSuite(true);
    }
  }, [availableDash]);

  useEffect(() => {
    setAvailableDash(availableDashboard);
  }, [avalReports.length]);

  useEffect(() => {
    if (addedToSuite.some((item: any) => item.checked === true)) {
      setDisableRemoveFromSuite(false);
    } else {
      setDisableRemoveFromSuite(true);
    }
  }, [addedToSuite]);

  useEffect(() => {
    if (currentSuite && currentSuite?.name !== '') {
      setSuiteName(currentSuite.name);
    }
    if (currentSuite && currentSuite?.id !== '') {
      setSuiteId(currentSuite.id);
    }
  }, [currentSuite]);

  const handleSnackbar = (value: boolean) => {
    setSnackbar(value);
  };

  const handleSnackbarType = (value: string) => {
    setSnackBarType(value);
  };

  const handleSnackbarMsg = (value: string) => {
    setSnackBarMsg(value);
  };

  const handleDelete = () => {
    try {
      handleDialogBox(false);
      dispatch(
        deleteSuiteAsync({
          token,
          url: platformBaseUrl,
          id: suiteId,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            setSnackbar(true);
            setSnackBarMsg('deleteSuiteSuccess');
            setSnackBarType('success');
            dispatch(setSuiteFormModified(false));
            if (token && selectedDomain !== '') {
              dispatch(
                getSuitesAsync({
                  token,
                  url: platformBaseUrl,
                  domain: selectedDomain,
                })
              )
                .unwrap()
                .then(
                  (value: any) => {
                    setSuiteName('');
                    setSuiteId('');
                  },
                  (reason: any) => {
                    setSnackbar(true);
                    setSnackBarMsg('fetchError');
                    setSnackBarType('failure');
                  }
                );
            }
          },
          (reason: any) => {
            setSnackbar(true);
            setSnackBarMsg('deleteSuiteFailure');
            setSnackBarType('failure');
          }
        );
      setSelectedPermission('');
    } catch (err) {
      console.log('failed to delete suite', err);
    }
  };

  useEffect(() => {
    if (currentWorkspaceId === undefined) {
      setWorkspaceId('');
    }
    if (currentWorkspaceId && currentWorkspaceId !== '') {
      setWorkspaceId(currentWorkspaceId);
    }
  }, [currentWorkspaceId]);

  useEffect(() => {
    setSuiteName('');
  }, [selectedDomain]);

  useEffect(() => {
    if (resetFormIndicator === true) {
      setSelectedPermission('');
      if (resetPermission) {
        setResetPermission(false);
        setAvailableDash(availableDashboard);
      } else if (resetDomain) {
        setSelectedDomain('');
        setResetDomain(false);
      } else {
        setSelectedOrgName('');
        setSelectedDomain('');
      }
      dispatch(setResetForm(false));
    }
  }, [resetFormIndicator]);

  useEffect(() => {
    if (selectedPermission === '') {
      setAddedToSuite([]);
      setDisableAddToSuite(true);
      setDisableRemoveFromSuite(true);
    } else if (availableDash.some((item) => item.checked === true)) {
      setDisableAddToSuite(false);
    }
  }, [selectedPermission, disableAddToSuite, disableRemoveFromSuite]);

  useEffect(() => {
    dispatch(
      getAvailableReportsAsync({
        token,
        url: platformBaseUrl,
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
  }, [selectedDomain]);

  useEffect(() => {
    if (currentReports) {
      setAddedToSuite(
        currentReports.map((report: any) => ({
          value: report.reportId,
          label: report.reportName,
          checked: false,
        }))
      );
    }
  }, [currentReports]);

  return (
    <Grid container spacing={1}>
      {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
      <DeleteSuite
        open={dialogBoxOpen}
        handleLeave={handleDialogBox}
        suiteName={suiteName}
        handleDelete={handleDelete}
      />
      {
        <UnsavedData
          open={unSavedDialogBoxOpen}
          handleLeave={handleUnSavedDialogBox}
          location="customReports"
        />
      }
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
          <Typography
            variant="subtitle1"
            fontSize="18px"
            color={theme.breadcrumLink.primary}
          >
            DASHBOARD /{' '}
            <Box component={'span'} sx={{ fontWeight: 'bold' }}>
              CUSTOM REPORTS
            </Box>
          </Typography>

          <IconButton sx={{ color: '#000000' }} onClick={closeCustomReport}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container paddingX={3}>
          <Card
            style={{
              paddingLeft: '30px',
              paddingRight: '30px',
              paddingTop: '30px',
              paddingBottom: '30px',
            }}
          >
            <Grid item xs={12}>
              <Box
                component="span"
                sx={{ alignSelf: 'self-end', textTransform: 'capitalize' }}
              >
                <Typography
                  fontSize={theme.typography.h3.fontSize}
                  fontWeight="bold"
                  color={theme.palette.blackFont.main}
                >
                  Manage Custom Reports
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} my={3}>
              <Grid container spacing={2}>
                <Grid xs={3} item>
                  <InputSelectWithLabel
                    label="Organization"
                    id="org"
                    placeholder="Select Organization"
                    options={orgList}
                    unsavedDataHandler={handleUnSavedDialogBox}
                    orgChangeHandler={handleOrgCodeChange}
                    value={selectedOrgName}
                  />
                </Grid>
                <Grid xs={3} item>
                  <InputSelectWithLabel
                    label="Domain"
                    id="domain"
                    placeholder="Select Domain"
                    options={orgDomainList}
                    disabled={isDomainDisabled}
                    unsavedDataHandler={changeCustomReportSelection}
                    orgChangeHandler={handleDomainChange}
                    handleDomainReset={resetDomainHandler}
                    value={selectedDomain}
                  />
                </Grid>
                {selectedDomain ? (
                  <>
                    <Grid xs={3} item>
                      <InputTextWithLabel
                        label="Power BI WorkSpace ID"
                        fieldName="workSPace ID"
                        formWidth="90%"
                        value={workspaceId}
                        disabled={isWorkSpaceIdDisabled}
                        changeHandler={workspaceIdChangeHandler}
                      />
                    </Grid>
                    <Button
                      variant="outlined"
                      sx={{ marginRight: theme.spacing(2), mt: 5, ml: 1 }}
                      onClick={
                        isWorkSpaceIdDisabled
                          ? enableWorkSpaceIdTextField
                          : disableWorkSpaceIdTextField
                      }
                    >
                      {isWorkSpaceIdDisabled
                        ? 'EDIT WORKSPACE ID'
                        : 'SAVE WORKSPACE ID'}
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
            {selectedDomain && permList.length > 0 ? (
              <>
                <Grid item xs={12}>
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
                      Add / Remove Dashboard from Suite
                    </Typography>
                  </Box>
                </Grid>
                <Grid container spacing={2} my={1} direction="row">
                  <Grid item xs={3}>
                    <Typography
                      sx={{
                        fontSize: `${theme.typography.subtitle1.fontSize}`,
                        fontWeight: 'bold',
                      }}
                    >
                      Available Dashboard
                    </Typography>
                    <Card
                      sx={{
                        width: '90%',
                        minHeight: '32vh',
                        maxHeight: '32vh',
                        overflowY: 'auto',
                      }}
                    >
                      <FormGroup>
                        {availableDash.map((report: ReportState) => (
                          <FormControlLabel
                            key={report.value}
                            control={<Checkbox />}
                            label={report.label}
                            value={report.value}
                            onChange={(e) => {
                              handleChange(e, report.value, report.label);
                            }}
                            checked={report.checked}
                            sx={{ ml: 1 }}
                          />
                        ))}
                      </FormGroup>
                    </Card>
                    <Box
                      sx={{
                        alignItems: 'flex-end',
                        display: 'flex',
                        justifyContent: 'end',
                        paddingX: theme.spacing(0),
                        marginRight: '10%',
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={reportsAddToSuite}
                        sx={{ mt: 2 }}
                        disabled={disableAddToSuite}
                      >
                        Add to Suite
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <InputSelectWithLabel
                      label="Select permissions to modify"
                      id="permission"
                      placeholder="Select Permission"
                      options={permList}
                      value={selectedPermission}
                      permissionChangeHandler={handlePermissionChange}
                      unsavedDataHandler={changeCustomReportSelection}
                      handlePermissionReset={resetPermisssionHandler}
                      required={true}
                    />
                    <Card
                      sx={{
                        width: '90%',
                        mt: 2,
                        minHeight: '26.5vh',
                        maxHeight: '26.5vh',
                        overflowY: 'auto',
                      }}
                    >
                      <FormGroup>
                        {addedToSuite?.map((report: ReportState) => (
                          <FormControlLabel
                            key={report.value}
                            control={<Checkbox />}
                            label={report.label}
                            value={report.value}
                            onChange={(e) => {
                              handleChangeAddedToSuite(
                                e,
                                report.value,
                                report.label
                              );
                            }}
                            checked={report.checked}
                            sx={{ ml: 1 }}
                          />
                        ))}
                      </FormGroup>
                    </Card>
                    <Button
                      variant="outlined"
                      disabled={disableRemoveFromSuite}
                      onClick={removeReports}
                      sx={{ mt: 2 }}
                    >
                      Remove Reports
                    </Button>
                  </Grid>
                  {selectedPermission ? (
                    <>
                      <Grid xs={3} item>
                        <InputTextWithLabel
                          id="suiteName"
                          label="Suite according permission"
                          fieldName="Suite according permission"
                          formWidth="90%"
                          value={suiteName}
                          error={suiteNameInvalid}
                          required={true}
                          changeHandler={suiteChangeHandler}
                          helperText={
                            suiteNameInvalid ? 'Suite Name is Required' : ''
                          }
                          focusHandler={onSuiteNameFocused}
                        />
                      </Grid>
                      <Button
                        variant="outlined"
                        sx={{
                          marginRight: theme.spacing(2),
                          mt: 5,
                          ml: 1,
                          height: '42px',
                        }}
                        onClick={() => setDialogBoxOpen(true)}
                        disabled={disableDeleteSuite}
                      >
                        DELETE SUITE
                      </Button>{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Card>
          <Grid item xs={12} my={2}>
            <Box
              sx={{
                alignItems: 'flex-end',
                display: 'flex',
                justifyContent: 'end',
                paddingX: theme.spacing(0),
              }}
            >
              <Box>
                <Button
                  variant="outlined"
                  sx={{ marginRight: theme.spacing(2) }}
                  onClick={closeCustomReport}
                >
                  BACK
                </Button>
                <Button
                  variant="outlined"
                  disabled={!suiteFormModified}
                  onClick={updateCustomReport}
                >
                  UPDATE
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomReports;
