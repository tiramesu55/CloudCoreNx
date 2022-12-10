import { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { Card, Snackbar, UnsavedData } from '@cloudcore/ui-shared';
import { useHistory } from 'react-router-dom';
import InputSelectWithLabel from '../../components/InputSelectWithLabel/InputSelectWithLabel';
import { InputTextWithLabel } from '../../components/input-text-with-label/input-text-with-label';
import {
  Organization,
  selectOrganizations,
  organizationList,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import {
  addSuiteAsync,
  deleteSuiteAsync,
  getSuitesAsync,
  getWorkspaceIDByDomainAsync,
  getSuiteByPermission,
  permissionsList,
  selectedSuite,
  getSuiteFormModified,
  setSuiteFormModified,
  resetAvailableReports,
  resetForm,
  setResetForm,
  selectedReports,
  updateSuiteAsync,
  getWorkspaceId,
  updateWorkSpaceIdByDomainAsync,
  getAvailableReportsAsync,
  availableReports,
  getOrganizationsAsync,
} from '@cloudcore/redux-store';
import DeleteSuite from './deleteSuite';
import { platformStore } from '@cloudcore/redux-store';
import TitleAndCloseIcon from '../../components/TitleAndClose/TitleAndClose';
import { IAlert, IAlertData } from '@cloudcore/common-lib';
import EditIcon from '@mui/icons-material/Edit';
import EditReportName from './editReportName';

interface ReportState {
  value: string;
  label: string;
  checked: boolean;
}

interface Props {
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}
const { useAppDispatch, useAppSelector } = platformStore;
const SuiteManagement = (props: Props) => {
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  const history = useHistory();
  const theme = useTheme();
  const orgList = useAppSelector(organizationList);
  const permList = useAppSelector(permissionsList);
  const avalReports = useAppSelector(availableReports);
  const dispatch = useAppDispatch();
  const { token } = useClaimsAndSignout() as UseClaimsAndSignout;
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
  const suiteByPermission = useAppSelector((state: any) =>
    getSuiteByPermission(state, selectedPermission)
  );
  const editedSuiteInfo = structuredClone(suiteByPermission);
  const closeSuiteManagement = () => {
    suiteFormModified ? setUnsavedDialogBoxOpen(true) : history.goBack();
  };
  const changeSuiteManagementSelection = () => {
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
    )
      .unwrap()
      .then(
        (value: any) => {
          dispatch(setSuiteFormModified(false));
          handleOpenAlert({
            content: 'Changes were updated successfully',
            type: 'success',
          });
        },
        (reason: any) => {
          handleOpenAlert({
            content: reason.message,
            type: 'error',
          });
        }
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

  const availableDashboard: ReportState[] =
    avalReports &&
    avalReports.map((rep: any) => {
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
  const [availableDashUpdated, setAvailableDashUpdated] = useState(false);
  const [disableAddToSuite, setDisableAddToSuite] = useState(true);
  const [disableRemoveFromSuite, setDisableRemoveFromSuite] = useState(true);
  const [removeFromSuite, setRemoveFromSuite] = useState([]) as any;
  const [removedFromSuite, setRemovedFromSuite] = useState([]) as any;
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState('');
  const [suiteNameInvalid, setSuiteNameInvalid] = useState(false);
  const [disableDeleteSuite, setDisableDeleteSuite] = useState(true);
  const [editReportNameDialog, setEditReportNameDialog] = useState(false);
  const [selectedReportToUpadted, setSelectedReportToUpdate] =
    useState<ReportState>();

  const updateSuiteManagement = () => {
    if (editedSuiteInfo) {
      editedSuiteInfo.name = suiteName;
      editedSuiteInfo.reports = addedToSuite.map((report) => {
        return { reportId: report.value, reportName: report.label };
      });
    }
    if (editedSuiteInfo && selectedPermission && suiteName) {
      dispatch(
        updateSuiteAsync({
          token,
          url: platformBaseUrl,
          suite: editedSuiteInfo,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            handleOpenAlert({
              content: 'Suite updated successfully',
              type: 'success',
            });
            dispatch(
              getSuitesAsync({
                token,
                url: platformBaseUrl,
                domain: selectedDomain,
              })
            );
            dispatch(setSuiteFormModified(false));
            setAvailableDashUpdated(false);
            setAddToSuite([]);
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    } else if (selectedPermission && suiteName) {
      dispatch(
        addSuiteAsync({
          token,
          url: platformBaseUrl,
          suite: {
            discriminator: 'suite',
            domain: selectedDomain,
            name: suiteName,
            permission: selectedPermission,
            reports: addedToSuite.map((report) => {
              return { reportId: report.value, reportName: report.label };
            }),
          },
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            handleOpenAlert({
              content: 'Suite updated successfully',
              type: 'success',
            });
            dispatch(setSuiteFormModified(false));
            setAvailableDashUpdated(false);
            setAddToSuite([]);
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
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
      setAvailableDashUpdated(false);
    }
    dispatch(resetAvailableReports());
  };

  const handleDomainChange = (event: any) => {
    setSelectedDomain(event);
    setIsDomainDisabled(false);
    setSelectedPermission('');
    dispatch(resetAvailableReports());
  };

  const handlePermissionChange = (event: any) => {
    setSelectedPermission(event);
    setDisableDeleteSuite(false);
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
    dispatch(setSuiteFormModified(true));
  };

  const workspaceIdChangeHandler = (event: any) => {
    setWorkspaceId(event.trim());
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
      setAvailableDashUpdated(true);
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
      setAvailableDashUpdated(true);
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
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
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
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    }
  }, [dispatch, token, platformBaseUrl, selectedDomain]);

  useEffect(() => {
    if (platformBaseUrl) {
      if (orgList && orgList.length === 0) {
        dispatch(
          getOrganizationsAsync({
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
    }
  }, [dispatch, platformBaseUrl, token]);

  useEffect(() => {
    if (availableDash.some((item) => item.checked === true)) {
      setDisableAddToSuite(false);
    } else {
      setDisableAddToSuite(true);
    }
  }, [availableDash]);

  useEffect(() => {
    if (availableDashboard && availableDashboard.length > 0) {
      setAvailableDash(availableDashboard);
    }

    if (avalReports && avalReports.length === 0) {
      setAvailableDash([]);
    }
  }, [avalReports ? avalReports.length : 0]);

  useEffect(() => {
    if (addedToSuite.some((item: any) => item.checked === true)) {
      setDisableRemoveFromSuite(false);
    } else {
      setDisableRemoveFromSuite(true);
    }
  }, [addedToSuite]);

  useEffect(() => {
    if (currentSuite) {
      if (currentSuite.name !== '') {
        setSuiteName(currentSuite.name);
      }
      if (currentSuite.id !== '') {
        setSuiteId(currentSuite.id);
      }
    } else {
      setSuiteName('');
      setSuiteId('');
    }
  }, [selectedPermission]);

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
            handleOpenAlert({
              content: 'Suite deleted successfully',
              type: 'success',
            });
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
                    handleOpenAlert({
                      content: reason.message,
                      type: 'error',
                    });
                  }
                );
            }
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
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
    if (currentWorkspaceId && currentWorkspaceId !== '') {
      dispatch(
        getAvailableReportsAsync({
          token,
          url: platformBaseUrl,
          workSpaceId: currentWorkspaceId,
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
  }, [currentWorkspaceId]);

  useEffect(() => {
    if (currentReports) {
      setAddedToSuite(
        currentReports.map((report: any) => ({
          value: report.reportId,
          label: report.reportName,
          checked: false,
        }))
      );
    } else {
      setAddedToSuite([]);
    }
  }, [selectedPermission]);

  /* Code to provide popup on reload of Add/edit user page, when data is modified */
  useEffect(() => {
    const preventUnload = (event: BeforeUnloadEvent) => {
      // NOTE: This message isn't used in modern browsers, but is required
      const message = 'Sure you want to leave?';
      event.preventDefault();
      event.returnValue = message;
    };
    if (suiteFormModified) {
      window.addEventListener('beforeunload', preventUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, [suiteFormModified]);

  //Edit Report Name
  const handleCloseEditReportNameDialog = () => {
    setEditReportNameDialog(false);
  };
  const handleEditReportIconClick = (report: any) => {
    setSelectedReportToUpdate(report);
    setEditReportNameDialog(true);
  };
  const handleUpdateReportName = (updatedReport: any) => {
    const updatedAddedToSuite = addedToSuite.map((ele) => {
      if (ele.value === updatedReport.value) {
        return {
          ...ele,
          label: updatedReport.label,
        };
      } else {
        return ele;
      }
    });
    setAddedToSuite([...updatedAddedToSuite]);
    setEditReportNameDialog(false);
    dispatch(setSuiteFormModified(true));
  };

  return (
    <Grid container spacing={1}>
      <Snackbar
        open={alertData.openAlert}
        type={alertData.type}
        content={alertData.content}
        onClose={handleCloseAlert}
        duration={3000}
      />
      <DeleteSuite
        open={dialogBoxOpen}
        handleLeave={handleDialogBox}
        suiteName={suiteName}
        handleDelete={handleDelete}
      />
      {
        <EditReportName
          open={editReportNameDialog}
          handleUpadteReportName={handleUpdateReportName}
          handleCloseDialog={handleCloseEditReportNameDialog}
          selectedReport={selectedReportToUpadted}
        />
      }
      {
        <UnsavedData
          open={unSavedDialogBoxOpen}
          handleLeave={handleUnSavedDialogBox}
          location="suiteManagement"
        />
      }
      <Grid item xs={12}>
        <TitleAndCloseIcon
          onClickButton={closeSuiteManagement}
          breadCrumbOrigin={'Suite Management'}
          breadCrumbTitle={''}
        />
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
                  Suite Management
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
                    unsavedDataHandler={changeSuiteManagementSelection}
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
                      disabled={
                        !isWorkSpaceIdDisabled && workspaceId === ''
                          ? true
                          : false
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
                      unsavedDataHandler={changeSuiteManagementSelection}
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
                        {addedToSuite.map((report: ReportState) => (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                            key={report.value}
                          >
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
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginRight: 1,
                                cursor: 'pointer',
                              }}
                            >
                              <EditIcon
                                onClick={() =>
                                  handleEditReportIconClick(report)
                                }
                              />
                            </Box>
                          </Box>
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
                  onClick={closeSuiteManagement}
                >
                  BACK
                </Button>
                <Button
                  variant="outlined"
                  disabled={!suiteFormModified}
                  onClick={updateSuiteManagement}
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

export default SuiteManagement;
