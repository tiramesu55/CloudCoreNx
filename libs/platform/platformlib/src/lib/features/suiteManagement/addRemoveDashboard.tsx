import { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Button,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { Card, theme } from '@cloudcore/ui-shared';
import {
  availableReports,
  getSuiteFormModified,
  permissionsList,
  platformStore,
  resetForm,
  selectedReports,
  selectedSuite,
  setSelectedPermission,
  setSelectedSuiteId,
  setSelectedSuiteName,
  setSuiteFormModified,
} from '@cloudcore/redux-store';
import InputSelectWithLabel from '../../components/InputSelectWithLabel/InputSelectWithLabel';
import { InputTextWithLabel } from '../../components/input-text-with-label/input-text-with-label';
import EditReportName from './editReportName';
import EditIcon from '@mui/icons-material/Edit';
import DeleteSuite from './deleteSuite';
import { IAlert, IAlertData } from '@cloudcore/common-lib';
import { betaIcon_img } from '@cloudcore/ui-shared';

interface ReportState {
  value: string;
  label: string;
  beta?: boolean;
  checked: boolean;
}

interface Props {
  selectedDomain: string;
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
  handleUnSavedDialogBox: (open: boolean) => void;
  resetPermissionHandler: (flag: boolean) => void;
  editedSuiteRef: any;
  resetPermission: boolean;
  suiteNameInvalid: boolean;
  handleSuiteNameInavlid: (value: boolean) => void;
  resetAddToSuite: boolean;
  resetAddToSuiteHandler: (value: boolean) => void;
  workspaceId: string;
}

const { useAppDispatch, useAppSelector } = platformStore;

const AddRemoveDashboardFromSuite = (props: Props) => {
  const dispatch = useAppDispatch();
  const permList = useAppSelector(permissionsList);
  const suiteFormModified = useAppSelector(getSuiteFormModified);
  const avalReports = useAppSelector(availableReports);
  const availableDashboard: ReportState[] =
    avalReports &&
    avalReports.map((rep: any) => {
      return {
        value: rep.ReportId,
        label: rep.ReportName,
        beta: rep.beta,
        checked: false,
      };
    });
  const [availableDash, setAvailableDash] = useState<ReportState[]>([]);
  const [availableDashUpdated, setAvailableDashUpdated] = useState(false);
  const [disableRemoveFromSuite, setDisableRemoveFromSuite] = useState(true);
  const [removeFromSuite, setRemoveFromSuite] = useState([]) as any;
  const [removedFromSuite, setRemovedFromSuite] = useState([]) as any;
  const [addToSuite, setAddToSuite] = useState<ReportState[]>([]);
  const [disableAddToSuite, setDisableAddToSuite] = useState(true);
  const [addedToSuite, setAddedToSuite] = useState<ReportState[]>([]);
  const selectedPermission = useAppSelector(
    (state) => state.suiteManagement.selectedPermission
  );
  const selectedSuiteName = useAppSelector(
    (state) => state.suiteManagement.selectedSuiteName
  );
  const [disableDeleteSuite, setDisableDeleteSuite] = useState(true);
  const [editReportNameDialog, setEditReportNameDialog] = useState(false);
  const [selectedReportToUpadted, setSelectedReportToUpdate] =
    useState<ReportState>();
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const currentReports = useAppSelector((state: any) =>
    selectedReports(state, selectedPermission)
  );
  const currentSuite = useAppSelector((state: any) =>
    selectedSuite(state, selectedPermission)
  );
  const resetFormIndicator = useAppSelector(resetForm);

  useEffect(() => {
    if (availableDashboard && availableDashboard.length > 0) {
      setAvailableDash(availableDashboard);
    }

    if (avalReports && avalReports.length === 0) {
      setAvailableDash([]);
    }
  }, [avalReports ? avalReports.length : 0]);

  useEffect(() => {
    if (resetFormIndicator) {
      if (props.resetPermission === true) {
        dispatch(setSelectedPermission(''));
        setAvailableDash(availableDashboard);
        setAddToSuite([]);
        setRemoveFromSuite([]);
      }
    }

    if (props.workspaceId === '') {
      setDisableDeleteSuite(true);
    } else {
      setDisableDeleteSuite(false);
    }
  }, [resetFormIndicator, props.workspaceId]);

  useEffect(() => {
    if (selectedPermission === '') {
      setDisableAddToSuite(true);
      setDisableRemoveFromSuite(true);
    }
    if (selectedPermission !== '') {
      if (availableDash.some((item) => item.checked === true)) {
        setDisableAddToSuite(false);
      } else {
        setDisableAddToSuite(true);
      }
      if (addedToSuite.some((item: any) => item.checked === true)) {
        setDisableRemoveFromSuite(false);
      } else {
        setDisableRemoveFromSuite(true);
      }
    }
  }, [selectedPermission, availableDash, addedToSuite]);

  useEffect(() => {
    if (selectedPermission && selectedSuiteName) {
      props.editedSuiteRef.current = addedToSuite.map((report) => {
        return {
          reportId: report.value,
          reportName: report.label,
          beta: report.beta,
        };
      });
    }
  }, [selectedPermission, addedToSuite, currentReports]);

  useEffect(() => {
    if (currentSuite) {
      if (currentSuite.name !== '') {
        dispatch(setSelectedSuiteName(currentSuite.name));
      }
      if (currentSuite.id !== '') {
        dispatch(setSelectedSuiteId(currentSuite.id));
      }
    } else {
      dispatch(setSelectedSuiteName(''));
      dispatch(setSelectedSuiteId(''));
    }

    if (currentReports) {
      setAddedToSuite(
        currentReports.map((report: any) => ({
          value: report.reportId,
          label: report.reportName,
          beta: report.beta,
          checked: false,
        }))
      );
    } else {
      setAddedToSuite([]);
    }
  }, [selectedPermission]);

  useEffect(() => {
    if (props.resetAddToSuite) {
      setAddToSuite([]);
      props.resetAddToSuiteHandler(false);
    }
  }, [props.resetAddToSuite]);

  const handlePermissionChange = (event: any) => {
    dispatch(setSelectedPermission(event));
    setDisableDeleteSuite(false);
  };

  const changeSuiteManagementSelection = () => {
    if (suiteFormModified) {
      props.handleUnSavedDialogBox(true);
    }
  };

  const handleChange = (
    e: any,
    val: string,
    label: string,
    beta: boolean | undefined
  ) => {
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
        { value: val, label: label, beta: beta, checked: false },
      ]) as any;
      e.target.checked = true;
      setDisableAddToSuite(false);
    } else {
      setAddToSuite((prev: ReportState[]) =>
        prev.filter((report: ReportState) => report.value !== val)
      );
    }
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

  const handleChangeAddedToSuite = (
    e: any,
    val: string,
    label: string,
    beta: boolean | undefined
  ) => {
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
        { value: val, label: label, beta: beta, checked: false },
      ]) as any;
    } else {
      setRemoveFromSuite((prev: ReportState[]) =>
        prev.filter((report: ReportState) => report.value !== val)
      );
    }
  };

  //Edit Report Name
  const handleEditReportNameDialog = (value: boolean, report?: any) => {
    if (value === true) {
      setSelectedReportToUpdate(report);
      setEditReportNameDialog(value);
    } else {
      setEditReportNameDialog(false);
    }
  };

  const handleUpdateReportName = (updatedReport: any) => {
    const updatedAddedToSuite = addedToSuite.map((ele) => {
      if (ele.value === updatedReport.value) {
        return {
          ...ele,
          label: updatedReport.label,
          beta: updatedReport.beta,
        };
      } else {
        return ele;
      }
    });
    setAddedToSuite([...updatedAddedToSuite]);
    setEditReportNameDialog(false);
    dispatch(setSuiteFormModified(true));
  };

  const suiteChangeHandler = (event: any) => {
    if (event.trim() === '') {
      props.handleSuiteNameInavlid(true);
    } else {
      props.handleSuiteNameInavlid(false);
    }
    dispatch(setSelectedSuiteName(event));
    dispatch(setSuiteFormModified(true));
  };

  //delete suite dialog handler
  const handleDialogBox = (open: boolean) => {
    setDialogBoxOpen(open);
  };

  return (
    <>
      {selectedReportToUpadted && (
        <EditReportName
          open={editReportNameDialog}
          handleUpadteReportName={handleUpdateReportName}
          handleCloseDialog={handleEditReportNameDialog}
          selectedReport={selectedReportToUpadted}
        />
      )}
      {
        <DeleteSuite
          open={dialogBoxOpen}
          handleLeave={handleDialogBox}
          suiteName={selectedSuiteName}
          handleOpenAlert={props.handleOpenAlert}
          handleCloseAlert={props.handleCloseAlert}
          alertData={props.alertData}
          selectedDomain={props.selectedDomain}
        />
      }
      <Grid container>
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
                      handleChange(e, report.value, report.label, report.beta);
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
              handlePermissionReset={props.resetPermissionHandler}
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
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'left',
                      }}
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
                            report.label,
                            report.beta
                          );
                        }}
                        checked={report.checked}
                        sx={{ ml: 1 }}
                      />
                      {report.beta && (
                        <Box
                          component={'img'}
                          src={betaIcon_img}
                          alt="Beta version"
                          sx={{
                            my: '2px',
                            background: '#6513f0',
                            border: theme.palette.primary.light,
                            padding: '5px',
                            borderRadius: '5px',
                            height: 'fit-content',
                          }}
                        />
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: 1,
                        cursor: 'pointer',
                      }}
                    >
                      <EditIcon
                        onClick={() => handleEditReportNameDialog(true, report)}
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
          {selectedPermission && (
            <>
              <Grid xs={3} item>
                <InputTextWithLabel
                  id="suiteName"
                  label="Suite according permission"
                  fieldName="Suite according permission"
                  formWidth="90%"
                  value={selectedSuiteName}
                  error={props.suiteNameInvalid}
                  required={true}
                  changeHandler={suiteChangeHandler}
                  helperText={
                    props.suiteNameInvalid ? 'Suite Name is Required' : ''
                  }
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
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default AddRemoveDashboardFromSuite;
