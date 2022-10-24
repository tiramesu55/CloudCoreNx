import { useContext, useState, useMemo } from 'react';
import { UnsavedData } from '../../components';
import { Snackbar, theme } from '@cloudcore/ui-shared';
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import {
  platformStore,
  getOrgCodeFromName,
  organizationList,
  importUserFile,
} from '@cloudcore/redux-store';
import { useHistory, useLocation } from 'react-router-dom';
import TitleAndCloseIcon from '../../components/TitleAndClose';
import LowerButton from '../../components/LowerButtons';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InputSelectWithLabel from '../../components/InputSelectWithLabel';
import ImportFile from '../../components/ImportFile';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

const style = {
  Card: {
    width: '100%',
    justifyContent: 'center',
    overflow: 'auto',
    paddingBottom: '10px',
  },
  Grid: {
    justifyContent: 'center',
  },
};

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
const UserOnboarding = () => {
  const config: IConfig = useContext(ConfigCtx)!;
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
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

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');

  const location: any = useLocation();
  const isUserOnboarding = location.state?.from === 'onboarding';
  const orgList = useAppSelector(organizationList);
  const orgWithCodes = useAppSelector(getOrgCodeFromName);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

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

  const backToInstructions = () => {
    formModified
      ? setDialogBoxOpen(true)
      : history.push(`${path}user/onboardingInstructions`);
  };

  const backToUsers = () => {
    formModified ? setDialogBoxOpen(true) : history.push(`${path}user`);
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
    setSnackbar(false);
    setSnackBarType('');
    setSnackBarMsg('');
  };

  window.onbeforeunload = function () {
    if (isUserOnboarding) {
      return 'Do you want to reload the page?';
    }
    return null;
  };

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

                setSnackbar(true);
                setSnackBarMsg('uploadUsersSuccess');
                setSnackBarType('success');
              } else {
                setAlert(true);
                setAlertContent('importUserFileWarning');
                setAlertSev('warning');

                setSnackbar(true);
                setSnackBarMsg('uploadUsersError');
                setSnackBarType('failure');
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

              setSnackbar(true);
              setSnackBarMsg('uploadUsersError');
              setSnackBarType('failure');
              console.log('test ' + snackbar);
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
          breadCrumbOrigin="ALL USERS"
          breadCrumbTitle="Import Users"
          onClickButton={backToUpload}
        ></TitleAndCloseIcon>
        {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
        <Grid item xs={12}>
          <Grid container style={style.Grid} paddingX={3}>
            <Card style={style.Card}>
              {alert ? (
                <Alert severity={alertSev}>{alertContent}</Alert>
              ) : (
                <></>
              )}
              <Grid py={4} px={2}>
                <Typography
                  fontSize={theme.typography.h3.fontSize}
                  fontWeight="bold"
                  color={theme.palette.blackFont.main}
                >
                  Import Users
                </Typography>
                <Grid container item>
                  <Grid item xs={12} style={{ alignContent: 'center' }}>
                    <Typography sx={{ marginBottom: 2 }}> </Typography>

                    <Typography variant="h3" style={{ textAlign: 'center' }}>
                      {response.reason}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    {' '}
                  </Grid>
                  <Grid item xs={4} sx={{}}>
                    {response.dataUpload ? (
                      <Typography
                        style={{
                          paddingLeft: '30%',
                          color: '#1B5E20',
                          textAlign: 'left',
                        }}
                      >
                        Valid users uploaded
                      </Typography>
                    ) : (
                      <Typography
                        style={{
                          paddingLeft: '30%',
                          color: '#C62828',
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
                    <Typography
                      style={{ paddingLeft: '30%', textAlign: 'left' }}
                    >
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
                      color="#C62828"
                      style={{ paddingLeft: '30%', textAlign: 'left' }}
                    >
                      Invalid Users: {response.invalidUsers}
                    </Typography>

                    <Typography
                      color="#1B5E20"
                      style={{ paddingLeft: '30%', textAlign: 'left' }}
                    >
                      Valid Users: {response.validUsers}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    {' '}
                  </Grid>
                  {badRecords.length > 0 || goodRecords.length > 0 ? (
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
                  ) : (
                    <></>
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

                <Button
                  variant="outlined"
                  onClick={backToUsers}
                  sx={{
                    marginRight: theme.spacing(2),
                  }}
                >
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
          breadCrumbOrigin="ALL USERS"
          breadCrumbTitle="Import Users"
          onClickButton={backToInstructions}
        ></TitleAndCloseIcon>
        {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
        <Grid item xs={12}>
          <Grid container paddingX={3} style={style.Grid}>
            <Card style={style.Card}>
              {alert ? (
                <Alert severity={alertSev}>{alertContent}</Alert>
              ) : (
                <></>
              )}
              <Grid py={4} px={2}>
                <Typography
                  fontSize={theme.typography.h3.fontSize}
                  fontWeight="bold"
                  color={theme.palette.blackFont.main}
                >
                  Import Users
                </Typography>
              </Grid>
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <InputLabel
                      style={{
                        marginTop: '25px',
                        marginRight: '10px',
                        color: '#6513F0',
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
                  </div>

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
                      //set the snackbar default to false
                      setSnackbar(false);
                      handleUpload();
                    }}
                  >
                    Import Data
                  </Button>
                  {alertContent.length > 0 ? (
                    <>
                      <Typography>
                        Error processing file, please review. Common issues are
                        listed below
                      </Typography>
                      <List sx={{ paddingLeft: '35%', alignContent: 'center' }}>
                        <ListItem style={{ alignContent: 'center' }}>
                          Empty Column Values
                        </ListItem>
                        <ListItem>Empty Rows</ListItem>
                        <ListItem>Duplicate Rows</ListItem>
                      </List>
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </Card>
            <LowerButton
              buttonName="BACK"
              onClickButton={backToInstructions}
            ></LowerButton>
          </Grid>
        </Grid>
      </Grid>
    )
  );
};

export default UserOnboarding;
