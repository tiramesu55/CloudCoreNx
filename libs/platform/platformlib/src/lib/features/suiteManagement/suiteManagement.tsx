import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { Card, Snackbar, UnsavedData } from '@cloudcore/ui-shared';
import { useHistory } from 'react-router-dom';
import InputSelectWithLabel from '../../components/InputSelectWithLabel/InputSelectWithLabel';
import { InputTextWithLabel } from '../../components/input-text-with-label/input-text-with-label';
import {
  addSuiteAsync,
  getSuitesAsync,
  getWorkspaceIDByDomainAsync,
  permissionsList,
  selectedSuite,
  getSuiteFormModified,
  setSuiteFormModified,
  resetAvailableReports,
  resetForm,
  setResetForm,
  updateSuiteAsync,
  getWorkspaceId,
  updateWorkSpaceIdByDomainAsync,
  getAvailableReportsAsync,
  getOrganizationsAsync,
  Organization,
  selectOrganizations,
  organizationList,
  setSelectedPermission,
  setSelectedSuiteName,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
  UseClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { platformStore } from '@cloudcore/redux-store';
import TitleAndCloseIcon from '../../components/TitleAndClose/TitleAndClose';
import { IAlert, IAlertData } from '@cloudcore/common-lib';
import AddRemoveDashboardFromSuite from './addRemoveDashboard';

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
  const dispatch = useAppDispatch();
  const { token } = useClaimsAndSignout() as UseClaimsAndSignout;
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const [selectedDomain, setSelectedDomain] = useState('');
  const selectedPermission = useAppSelector(
    (state) => state.suiteManagement.selectedPermission
  );
  const selectedSuiteName = useAppSelector(
    (state) => state.suiteManagement.selectedSuiteName
  );
  const [resetDomain, setResetDomain] = useState(false);
  const [resetPermission, setResetPermission] = useState(false);
  const [resetAddToSuite, setResetAddToSuite] = useState(false);
  const [unSavedDialogBoxOpen, setUnsavedDialogBoxOpen] = useState(false);
  const config: IConfig = useContext(ConfigCtx) as IConfig; // at this point config is not null (see app)
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const currentWorkspaceId = useAppSelector((state: any) =>
    getWorkspaceId(state, selectedDomain)
  );
  const currentSuite = useAppSelector((state: any) =>
    selectedSuite(state, selectedPermission)
  );
  const editedSuiteInfo = structuredClone(currentSuite);
  const closeSuiteManagement = () => {
    suiteFormModified ? setUnsavedDialogBoxOpen(true) : history.push(path);
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
  const resetPermissionHandler = (flag: boolean) => {
    setResetPermission(flag);
  };
  const [isWorkSpaceIdDisabled, setIsWorkSpaceIdDisabled] = useState(true);
  const [isDomainDisabled, setIsDomainDisabled] = useState(true);
  const [selectedOrgName, setSelectedOrgName] = useState<string>('');
  const [orgDomainList, setOrgDomainList] = useState<string[]>([]);
  const organizations = useAppSelector(selectOrganizations);
  const suiteFormModified = useAppSelector(getSuiteFormModified);
  const resetFormIndicator = useAppSelector(resetForm);

  const [workspaceId, setWorkspaceId] = useState('');
  const [suiteNameInvalid, setSuiteNameInvalid] = useState(false);
  const [disableDeleteSuite, setDisableDeleteSuite] = useState(true);
  const editedSuiteRef = useRef(null);

  const updateSuiteManagement = () => {
    if (editedSuiteInfo) {
      editedSuiteInfo.name = selectedSuiteName.trim();
      editedSuiteInfo.reports = editedSuiteRef.current;
    }
    if (editedSuiteInfo && selectedPermission && selectedSuiteName) {
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
            setResetAddToSuite(true);
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    } else if (selectedPermission && selectedSuiteName) {
      dispatch(
        addSuiteAsync({
          token,
          url: platformBaseUrl,
          suite: {
            discriminator: 'suite',
            domain: selectedDomain,
            name: selectedSuiteName.trim(),
            permission: selectedPermission,
            reports: editedSuiteRef.current,
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
            dispatch(
              getSuitesAsync({
                token,
                url: platformBaseUrl,
                domain: selectedDomain,
              })
            );
            dispatch(setSuiteFormModified(false));
            setResetAddToSuite(true);
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    } else if (selectedSuiteName === '') {
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
    dispatch(setSelectedPermission(''));
    setIsWorkSpaceIdDisabled(true);
    dispatch(resetAvailableReports());
  };

  const handleSuiteNameInavlid = (value: boolean) => {
    setSuiteNameInvalid(value);
  };

  const resetAddTosuiteHandler = (value: boolean) => {
    setResetAddToSuite(value);
  };

  const handleDomainChange = (event: any) => {
    setSelectedDomain(event);
    setIsDomainDisabled(false);
    dispatch(setSelectedPermission(''));
    dispatch(resetAvailableReports());
  };

  const handleUnSavedDialogBox = (open: boolean) => {
    setUnsavedDialogBoxOpen(open);
  };

  const workspaceIdChangeHandler = (event: any) => {
    setWorkspaceId(event.trim());
    dispatch(setSuiteFormModified(true));
    event.trim() ? setDisableDeleteSuite(false) : setDisableDeleteSuite(true);
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
    if (currentWorkspaceId === undefined) {
      setWorkspaceId('');
    }
    if (currentWorkspaceId && currentWorkspaceId !== '') {
      setWorkspaceId(currentWorkspaceId);
    }
  }, [currentWorkspaceId]);

  useEffect(() => {
    dispatch(setSelectedSuiteName(''));
  }, [selectedDomain]);

  useEffect(() => {
    if (resetFormIndicator === true) {
      dispatch(setSelectedPermission(''));
      if (resetPermission) {
        setResetPermission(false);
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

  return (
    <Grid container spacing={1}>
      <Snackbar
        open={alertData.openAlert}
        type={alertData.type}
        content={alertData.content}
        onClose={handleCloseAlert}
        duration={3000}
      />
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
              <AddRemoveDashboardFromSuite
                selectedDomain={selectedDomain}
                handleOpenAlert={handleOpenAlert}
                handleCloseAlert={handleCloseAlert}
                alertData={alertData}
                handleUnSavedDialogBox={handleUnSavedDialogBox}
                resetPermissionHandler={resetPermissionHandler}
                editedSuiteRef={editedSuiteRef}
                resetPermission={resetPermission}
                suiteNameInvalid={suiteNameInvalid}
                handleSuiteNameInavlid={handleSuiteNameInavlid}
                resetAddToSuite={resetAddToSuite}
                resetAddToSuiteHandler={resetAddTosuiteHandler}
                workspaceId={workspaceId}
              />
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
