import React, { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Box,
  IconButton,
  Typography,
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { DateAndTimeInput } from '../components/date-and-time-input/dateAndTimeInput';
import moment from 'moment-timezone';
import { parseISO } from 'date-fns';
import {
  createMaintenance,
  getMaintenanceAsync,
  platformStore,
} from '@cloudcore/redux-store';
import { ConfigCtx, IConfig, useOktaAuth } from '@cloudcore/okta-and-config';
import { CustomMultiSelectBox } from '../components/custom-multi-select-box/custom-multi-select-box';

interface Application {
  appCode: string;
  name: string;
}
interface Props {
  open: boolean;
  handleClose: (value: boolean) => void;
  allApps: Application[];
}

const { useAppDispatch } = platformStore;

const EditMaintenanceMode = (props: Props) => {
  // const [open, setOpen] = useState(props.open);
  const [maintenanceStartDate, setMaintenanceStartDate] = useState(new Date());
  const [maintenanceEndDate, setMaintenanceEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [fullLockOut, setFullLockOut] = useState(false);
  const [invalidReason, setInvalidReason] = useState(false);
  const [invalidDate, setInvalidDate] = useState(false);
  const [announcementStartDate, setAnnoucementStartDate] = useState(new Date());
  const [appCode, setAppCode] = useState<string[]>([]);
  const [inputList, setInputList] = useState<Application[]>([]);
  const [invalidAppCode, setInvalidAppCode] = useState(false);
  //const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { platformBaseUrl } = useContext(ConfigCtx) as IConfig; // at this point config is not null (see app)
  const { oktaAuth } = useOktaAuth();
  const token = oktaAuth?.getAccessToken();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleClose = () => {
    props.handleClose(false);
    setInvalidReason(false);
    setInvalidAppCode(false);
    setFullLockOut(false);
    setMaintenanceStartDate(new Date());
    setMaintenanceEndDate(new Date());
    setAnnoucementStartDate(new Date());
    setAppCode([]);
    setInputList([]);
    setReason('');
  };

  const handleMaintanenceStartDate = (value: any) => {
    setMaintenanceStartDate(value);
  };

  const handleMaintanenceEndDate = (value: any) => {
    setMaintenanceEndDate(value);
  };

  const handleAnnouncementStartDate = (value: any) => {
    setAnnoucementStartDate(value);
  };

  const handleInvalidDate = (value: boolean) => {
    setInvalidDate(value);
  };

  const handleReasonChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value !== '') {
      setInvalidReason(false);
    } else {
      setInvalidReason(true);
    }
    setReason(event.target.value);
  };

  const handleChangeFullLockOut = () => {
    setFullLockOut(!fullLockOut);
  };

  const handleAppChange = (updatedList: Application[]) => {
    setInputList([...updatedList]);
    const maintenanceAppCode: string[] = updatedList.map((app) => app.appCode);
    setAppCode([...maintenanceAppCode]);
    if (updatedList.length > 0) {
      setInvalidAppCode(false);
    } else {
      setInvalidAppCode(true);
    }
  };

  const validReason = reason === null || reason === '' ? false : true;
  const validAppCode = appCode.length > 0 ? true : false;

  const handleSubmit = () => {
    if (!invalidDate && validReason && validAppCode) {
      dispatch(
        createMaintenance({
          url: platformBaseUrl,
          token: token,
          data: {
            maintenanceStartDate: moment(maintenanceStartDate)
              .tz('est')
              .format('MM-DD-YYYY HH:mm'),
            maintenanceEndDate: moment(maintenanceEndDate)
              .tz('est')
              .format('MM-DD-YYYY HH:mm'),
            maintenanceDisplayStartDate: moment(announcementStartDate)
              .tz('est')
              .format('MM-DD-YYYY HH:mm'),
            maintenanceDisplayEndDate: moment(maintenanceEndDate)
              .tz('est')
              .format('MM-DD-YYYY HH:mm'),
            maintenanceReason: reason,
            bypassUsers: ['rosh@gmail.com', 'alec@gmail.com'],
            appCode: [...appCode],
            fullLockOut,
          },
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            getMaintenanceAsync({
              url: platformBaseUrl,
              token: token,
            })
          );
          handleClose();
        });
    } else {
      if (appCode.length < 1) {
        setInvalidAppCode(true);
      }
      if (reason === null || reason === '') {
        setInvalidReason(true);
      }
    }
  };

  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'sm'}
        fullWidth={true}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.secondary.main,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <Box>
            <Typography
              component="span"
              variant="h4"
              fontWeight={'bold'}
              sx={{ color: `${theme.palette.blackFont.main}` }}
            >
              Maintenance
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: `${theme.palette.blackFont.main}`,
                }}
                onClick={handleClose}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={'div'}>
            <Grid container spacing={1.5} sx={{ paddingY: '5px' }}>
              <Grid item xs={2.4}>
                <Typography
                  sx={{
                    color: `${theme.palette.text.primary}`,
                    paddingY: '15px',
                  }}
                >
                  Start
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <DateAndTimeInput
                  value={maintenanceStartDate}
                  handleMaintStartDate={(value) =>
                    handleMaintanenceStartDate(value)
                  }
                  invalidDate={(value: boolean) => handleInvalidDate(value)}
                />
              </Grid>

              <Grid item xs={2.4}>
                <Typography
                  sx={{
                    color: `${theme.palette.text.primary}`,
                    paddingY: '15px',
                  }}
                >
                  End
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <DateAndTimeInput
                  value={maintenanceEndDate}
                  minDateAndTime={parseISO(
                    moment(maintenanceStartDate).format()
                  )}
                  handleMaintEndDate={(value) =>
                    handleMaintanenceEndDate(value)
                  }
                  invalidDate={(value: boolean) => handleInvalidDate(value)}
                />
              </Grid>
              <Grid item xs={2.4}>
                <Typography
                  sx={{
                    color: `${theme.palette.text.primary}`,
                    paddingY: '15px',
                  }}
                >
                  Applications
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <CustomMultiSelectBox
                  application={''}
                  inputAppList={[...inputList]}
                  appsList={props.allApps}
                  customSelectLabel="Select Applications"
                  handleAppChange={handleAppChange}
                  invalid={invalidAppCode}
                  helperText={'Select atleast one application'}
                />
              </Grid>
              <Grid item xs={2.4}>
                <Typography
                  sx={{
                    color: `${theme.palette.text.primary}`,
                    paddingY: '20px',
                  }}
                >
                  Reason
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={reason}
                  onChange={(e) => {
                    handleReasonChange(e);
                  }}
                  required
                  error={invalidReason}
                  helperText={invalidReason ? 'Reason Required' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Box paddingLeft={theme.spacing(0)}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={fullLockOut}
                        onChange={handleChangeFullLockOut}
                        inputProps={{ 'aria-label': 'controlled' }}
                        color="primary"
                        sx={{
                          color: 'primary',
                          '&.Mui-checked': {
                            color: 'primary',
                          },
                        }}
                      />
                    }
                    label="Full Lockout"
                    labelPlacement="end"
                    sx={{
                      paddingTop: '16px',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  fontWeight={'bold'}
                  sx={{ color: `${theme.palette.blackFont.main}` }}
                >
                  Display Announcement
                </Typography>
              </Grid>
              <Grid item xs={2.4}>
                <Typography
                  sx={{
                    color: `${theme.palette.text.primary}`,
                    paddingY: '15px',
                  }}
                >
                  Start
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <DateAndTimeInput
                  value={announcementStartDate}
                  handleAnnounceStartDate={(value) =>
                    handleAnnouncementStartDate(value)
                  }
                  invalidDate={(value: boolean) => handleInvalidDate(value)}
                  maxDateAndTime={parseISO(
                    moment(maintenanceStartDate).add(1, 'm').format()
                  )}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} data-testid="save">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditMaintenanceMode;
