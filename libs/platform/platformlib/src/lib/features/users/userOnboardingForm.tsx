import { useContext, useState, useMemo, useEffect } from 'react';
import { Snackbar, UnsavedData } from '@cloudcore/ui-shared';
import Stepper from '@mui/material/Stepper';
import {
  Alert,
  AlertColor,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  Step,
  StepLabel,
  Typography,
  useTheme,
} from '@mui/material';
import { Card } from '@cloudcore/ui-shared';
import {
  platformStore,
  getOrgCodeFromName,
  organizationList,
  importUserFile,
} from '@cloudcore/redux-store';
import { useHistory } from 'react-router-dom';
import TitleAndCloseIcon from '../../components/TitleAndClose/TitleAndClose';
import LowerButton from '../../components/LowerButtons/LowerButtons';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InputSelectWithLabel from '../../components/InputSelectWithLabel/InputSelectWithLabel';
import ImportFile from '../../components/ImportFile/ImportFile';
import {
  ConfigCtx,
  IConfig,
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { IAlert, IAlertData } from '@cloudcore/common-lib';

const steps = [
  {
    label: 'Step 1',
    line1: 'Download template,\nadd user info and save as CSV',
  },
  {
    label: 'Step 2',
    line1: `Select Organization \nand file to import`,
  },
  {
    label: 'Step 3',
    line1: `Import Data`,
  },
];

interface Props {
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}

interface Record {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  title: string;
  city: string;
  street: string;
  zip: string;
  state: string;
  orgcode: string;
}

interface InvalidRecord {
  RowNumber: number;
  Record: Record;
  IsValid: boolean;
  Errors: string;
}

interface ValidRecord {
  RowNumber: number;
  Record: Record;
  IsValid: boolean;
  Errors: string;
}

interface Response {
  readUsers: number;
  validUsers: number;
  invalidUsers: number;
  dataUpload: boolean;
  reason: string;
  invalidRecords: InvalidRecord[];
  validRecords: ValidRecord[] | [];
}

interface DisplayRecord {
  Correct: boolean;
  RowNumber: number;
  Email: string;
  Errors: string;
}

const UserOnboarding = (props: Props) => {
  const theme = useTheme();
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  const config: IConfig = useContext(ConfigCtx) as IConfig;
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token } = useClaimsAndSignout() as UseClaimsAndSignout;
  const { useAppDispatch, useAppSelector } = platformStore;
  const [org, setOrg] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [badRecords, setBadRecords] = useState<DisplayRecord[]>([]);
  const [goodRecords, setGoodRecords] = useState<DisplayRecord[]>([]);
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [alertSev, setAlertSev] = useState<AlertColor>('error');
  const [response, setResponse] = useState<Response | null>(null);
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [formModified, setFormModified] = useState(false);

  //const location: any = useLocation();
  //const isUserOnboarding = location.state?.from === 'onboarding';
  const orgList = useAppSelector(organizationList);
  const orgWithCodes = useAppSelector(getOrgCodeFromName);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { platformBaseUrl } = config; // at this point config is not null (see app)

  const options: MUIDataTableOptions = {
    selectableRowsHideCheckboxes: true,
    selectableRowsOnClick: false,
    pagination: true,
    tableBodyMaxHeight: '75vh',
    filter: false,
    viewColumns: false,
    print: false,
    download: false,
    filterType: 'multiselect',
    enableNestedDataAccess: '.',
    search: false,
    rowHover: false,

    setRowProps: (data, dataIndex, rowIndex) => {
      if (data[3].length > 0) {
        return {
          //#D32F2F
          style: {
            backgroundColor:
              rowIndex % 2 === 0
                ? 'rgba(211, 47, 47, 0.4)'
                : 'rgba(211, 47, 47, 0.3)',
          },
        };
      } else {
        return {
          style: {},
        };
      }
    },
  };

  const columns = [
    {
      name: 'Correct',
      options: {
        customBodyRender: (value: any) => {
          if (value === true)
            return <CheckCircleOutlineIcon></CheckCircleOutlineIcon>;
          else return <ErrorOutlineIcon></ErrorOutlineIcon>;
        },
      },
    },
    'RowNumber',
    'Email',
    'Errors',
  ];
  const handleDialogBox = (open: boolean) => {
    setDialogBoxOpen(open);
  };

  const backToUsers = () => {
    formModified ? setDialogBoxOpen(true) : history.push(`${path}user`);
  };

  //stepper changes
  const [activeStep, setActiveStep] = useState(0);

  const checkTemplate = () => {
    setActiveStep(1);
  };
  const checkOrgfile = () => {
    setActiveStep(2);
  };
  const checkImport = () => {
    setActiveStep(3);
  };

  //columns for template csv download
  const columnsDownload =
    'email,firstname,lastname,phone,title,city,street,zip,state';

  const download = (data: string) => {
    checkTemplate();
    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);
    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a');
    // Passing the blob downloading url
    a.setAttribute('href', url);
    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', 'template.csv');
    // Performing a download with click
    a.click();
  };

  const backToUpload = () => {
    setOrg('');
    setOrgCode('');
    setCsvFile(null);
    setFileName('');
    setBadRecords([]);
    setGoodRecords([]);
    setAlert(false);
    setAlertContent('');
    setAlertSev('error');
    setResponse(null);
    setDialogBoxOpen(false);
    //we don't want to force them to redonwload
    //if just stepping back
    setActiveStep(1);
  };

  /* Code to provide popup on reload of page, when data is modified */
  useEffect(() => {
    const preventUnload = (event: BeforeUnloadEvent) => {
      // NOTE: This message isn't used in modern browsers, but is required
      const message = 'Sure you want to leave?';
      event.preventDefault();
      event.returnValue = message;
    };
    if (formModified) {
      window.addEventListener('beforeunload', preventUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, [formModified]);

  function updateOrgCode(data: string) {
    const org = orgWithCodes.find((p) => p.name?.includes(data));
    const code = org?.orgCode;
    const codeOrEmpty = code ? code : '';
    setOrgCode(codeOrEmpty);
  }

  //set the selected organization from Select component here
  function handleSelectionUpdate(data: string) {
    setOrg(data);
    updateOrgCode(data);
    //set this to null in case it was already selected
    //and user changed org
    handleImportFileUpdate(null, '');
    setFormModified(true);
  }

  //set the selected File from ImportFile component here
  function handleImportFileUpdate(f: File | null, s: string) {
    setCsvFile(f);
    setFileName(s);
    //we only move forward if both org and file are selected
    if (f != null || s.length > 0) {
      checkOrgfile();
    } else {
      //if not mark step 2 as active
      checkTemplate();
    }
    //this is disabled until org is selected
  }

  //Format response for display
  const formattedResponse = (a: any) => {
    const res = a.data as Response;
    if (res.invalidRecords.length > 0) {
      const r = getBadRecords(res);
      setBadRecords(r);
    }

    if (res.validRecords.length > 0) {
      const g = getGoodRecords(res);
      setGoodRecords(g);
    }
    //for quick checks return as well
    return res;
  };

  //Get the bad records from response
  const getBadRecords = (a: Response) => {
    const bad: DisplayRecord[] = [];
    a.invalidRecords.forEach((x) => {
      const b: DisplayRecord = {
        Correct: false,
        RowNumber: x.RowNumber + 1, //The API doesn't count header as a row
        Email: x.Record.email,
        Errors: x.Errors,
      };
      bad.push(b);
    });
    return bad;
  };

  //Get the good records from response
  const getGoodRecords = (a: Response) => {
    const good: DisplayRecord[] = [];
    a.validRecords.forEach((x) => {
      const b = {
        Correct: true,
        RowNumber: x.RowNumber + 1, //The API doesn't count header as a row
        Email: x.Record.email,
        Errors: x.Errors,
      };
      good.push(b);
    });
    return good;
  };

  const handleUpload = () => {
    checkImport();
    //var startTime = new Date()
    if (csvFile) {
      const formData = new FormData();
      //name of file selected
      formData.append('name', fileName);
      //file object
      formData.append('file', csvFile);
      //org code from dropdown
      formData.append('orgCode', orgCode);
      const uploadFile = formData;
      try {
        dispatch(
          importUserFile({
            upload: uploadFile,
            url: platformBaseUrl,
            token: token,
          })
        )
          .unwrap()
          .then(
            (value) => {
              const res = formattedResponse(value);
              //set the response data to display
              setResponse(res);
              //invalid+valid =read means file was in correct format
              //DataUpload =true means some data was actually uploaded
              if (
                res.invalidUsers + res.validUsers === res.readUsers &&
                res.dataUpload === true
              ) {
                setAlert(true);
                setAlertContent('importUserFileSuccess');
                setAlertSev('success');
                handleOpenAlert({
                  content: 'Users uploaded successfully',
                  type: 'success',
                });
              } else {
                setAlert(true);
                setAlertContent('importUserFileWarning');
                setAlertSev('warning');
                handleOpenAlert({
                  content: 'Error while uploading Users',
                  type: 'error',
                });
              }
              //Their state can't be reused so we don't care
              setFormModified(false);
              // var endTime = new Date()
              // var seconds = (endTime.getTime() - startTime.getTime()) / 1000;
            },
            (reason: any) => {
              setFormModified(false);
              setAlert(true);
              setAlertContent('importUserFileFailure - ' + reason.message);
              setAlertSev('error');
              handleOpenAlert({
                content: reason.message,
                type: 'error',
              });
            }
          );
      } catch (err) {
        console.error('Failed to import the user file', err);
      }
    }
  };
  return (
    // if we have a response display it
    response ? (
      <Grid container>
        <UnsavedData
          open={dialogBoxOpen}
          handleLeave={handleDialogBox}
          location="onboarding"
        />
        <TitleAndCloseIcon
          breadCrumbOrigin="All Users"
          breadCrumbTitle="Import Users"
          onClickButton={backToUpload}
        />
        <Snackbar
          open={alertData.openAlert}
          type={alertData.type}
          content={alertData.content}
          onClose={handleCloseAlert}
          duration={3000}
        />
        <Grid item xs={12}>
          <Grid container paddingX={3}>
            <Card>
              {alert && <Alert severity={alertSev}>{alertContent}</Alert>}
              <Grid py={4} px={2}>
                <Typography
                  fontSize={theme.typography.h3.fontSize}
                  fontWeight="bold"
                  color={theme.palette.blackFont.main}
                >
                  Import Users
                </Typography>
                <Grid container item>
                  <Grid item xs={12} sx={{ alignContent: 'center' }}>
                    <Typography sx={{ marginBottom: 2 }}> </Typography>

                    <Typography variant="h3" sx={{ textAlign: 'center' }}>
                      {response.reason}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    {' '}
                  </Grid>
                  <Grid item xs={4} sx={{}}>
                    {response.dataUpload ? (
                      <Typography
                        sx={{
                          paddingLeft: '30%',
                          color: theme.palette.success.dark,
                          textAlign: 'left',
                        }}
                      >
                        Valid users uploaded
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          paddingLeft: '30%',
                          color: theme.palette.error.dark,
                          textAlign: 'left',
                        }}
                      >
                        No users uploaded
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {' '}
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingLeft: '30%', textAlign: 'left' }}>
                      Number of Users Read: {response.readUsers}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    {' '}
                  </Grid>

                  <Grid item xs={4}>
                    {' '}
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      sx={{
                        paddingLeft: '30%',
                        textAlign: 'left',
                        color: theme.palette.error.dark,
                      }}
                    >
                      Invalid Users: {response.invalidUsers}
                    </Typography>

                    <Typography
                      sx={{
                        color: theme.palette.success.dark,
                        paddingLeft: '30%',
                        textAlign: 'left',
                      }}
                    >
                      Valid Users: {response.validUsers}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    {' '}
                  </Grid>
                  {(badRecords.length > 0 || goodRecords.length > 0) && (
                    <>
                      <Grid item xs={2}>
                        {' '}
                      </Grid>
                      <Grid item xs={8}>
                        <MUIDataTable
                          title={''}
                          data={badRecords
                            .concat(goodRecords)
                            .sort((a, b) =>
                              a.RowNumber < b.RowNumber
                                ? -1
                                : a.RowNumber > b.RowNumber
                                ? 1
                                : 0
                            )}
                          columns={columns}
                          options={options}
                        />
                      </Grid>
                      <Grid item xs={2}></Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </Card>
            <Grid item xs={12} my={2}>
              <Box
                sx={{
                  alignItems: 'flex-end',
                  display: 'flex',
                  justifyContent: 'end',
                  paddingX: 0,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={backToUpload}
                  sx={{
                    marginRight: theme.spacing(2),
                  }}
                >
                  BACK
                </Button>

                <Button variant="outlined" onClick={backToUsers}>
                  BACK TO USERS
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    ) : (
      <Grid container>
        <UnsavedData
          open={dialogBoxOpen}
          handleLeave={handleDialogBox}
          location="onboarding"
        />
        <TitleAndCloseIcon
          breadCrumbOrigin="All Users"
          breadCrumbTitle="Import Users"
          onClickButton={backToUsers}
        ></TitleAndCloseIcon>
        <Snackbar
          open={alertData.openAlert}
          type={alertData.type}
          content={alertData.content}
          onClose={handleCloseAlert}
          duration={3000}
        />
        <Grid item xs={12}>
          <Grid container paddingX={3}>
            <Card>
              {alert && <Alert severity={alertSev}>{alertContent}</Alert>}
              <Grid py={4} px={2}>
                <Typography
                  fontSize={theme.typography.h3.fontSize}
                  fontWeight="bold"
                  color={theme.palette.blackFont.main}
                >
                  Import Users
                </Typography>
                <Box sx={{ width: '100%', height: '40px' }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label.label}>
                        <StepLabel sx={{ whiteSpace: 'pre-line' }}>
                          {label.line1}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Grid>
              {activeStep > 0 ? ( //if template downloaded show org and file select
                <Grid container item sx={{ marginBottom: '10%' }}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      alignSelf: 'center',
                      textAlign: 'center',
                      alignContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <InputLabel
                        sx={{
                          marginTop: theme.spacing(3),
                          marginRight: theme.spacing(1.5),
                          color: theme.palette.primary.main,
                        }}
                        id="custom-select"
                      >
                        {'Organization'}
                      </InputLabel>
                      <FormControl sx={{ width: '20%' }}>
                        <InputSelectWithLabel
                          id="org"
                          placeholder="Select Organization"
                          options={orgList}
                          orgChangeHandler={handleSelectionUpdate}
                          value={org}
                        />
                      </FormControl>
                    </Box>

                    <ImportFile
                      title="Import File"
                      org={org}
                      fileName={fileName}
                      onImportFileUpdate={handleImportFileUpdate}
                    ></ImportFile>

                    <Button
                      disabled={
                        fileName.length > 0 && org.length > 0 ? false : true
                      }
                      variant="outlined"
                      sx={{
                        marginRight: theme.spacing(2),
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpload();
                      }}
                    >
                      Import Data
                    </Button>
                    {alertContent.length > 0 ? (
                      <>
                        <Typography>
                          Error processing file, please review. Common issues
                          are listed below
                        </Typography>
                        <List
                          sx={{ paddingLeft: '35%', alignContent: 'center' }}
                        >
                          <ListItem sx={{ alignContent: 'center' }}>
                            Empty Column Values
                          </ListItem>
                          <ListItem>Empty Rows</ListItem>
                          <ListItem>Duplicate Rows</ListItem>
                        </List>
                      </>
                    ) : null}
                  </Grid>
                </Grid>
              ) : (
                //if template not downloaded show download button
                <Grid container item sx={{ marginBottom: '10%' }}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      alignSelf: 'center',
                      textAlign: 'center',
                      alignContent: 'center',
                      marginTop: theme.spacing(5),
                    }}
                  >
                    <Button
                      color="primary"
                      variant="outlined"
                      component="span"
                      onClick={() => {
                        download(columnsDownload);
                      }}
                    >
                      Get Template
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Card>
            <LowerButton
              buttonName="BACK"
              onClickButton={backToUsers}
            ></LowerButton>
          </Grid>
        </Grid>
      </Grid>
    )
  );
};

export default UserOnboarding;
