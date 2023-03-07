import { useEffect, useState } from 'react';
import {
  Button,
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { InputTextWithLabel } from '../../components';

interface Report {
  label: string;
  value: string;
  beta?: boolean;
}

interface Props {
  open: boolean;
  selectedReport: Report;
  handleCloseDialog: (value: boolean) => void;
  handleUpadteReportName: (updatedReport: any) => void;
}

const EditReportName = (props: Props) => {
  const [report, setReport] = useState<Report>({
    value: '',
    label: '',
  });
  const [invalidReportName, setInvalidReportName] = useState(false);
  const theme = useTheme();

  const handleClose = () => {
    props.handleCloseDialog(false);
    setInvalidReportName(false);
  };

  const onChangeHandler = (event: any) => {
    if (event.trim() === '') {
      setInvalidReportName(true);
    } else {
      setInvalidReportName(false);
    }
    report && setReport({ ...report, label: event });
  };

  const onChangeIconHandler = (event: any) => {
    report && setReport({ ...report, beta: !report.beta });
  };

  useEffect(() => {
    setReport(props.selectedReport);
  }, [props.selectedReport]);

  return (
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
      <DialogTitle id="alert-dialog-title" component={'div'}>
        <Box>
          <Typography
            component="span"
            variant="h4"
            fontWeight={'bold'}
            sx={{ color: `${theme.palette.blackFont.main}` }}
          >
            Edit Report Name
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
          <Box
            width={'100%'}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <InputTextWithLabel
              fieldName="reportName"
              formWidth="95%"
              label="Selected Report Name"
              value={report.label}
              changeHandler={onChangeHandler}
              error={invalidReportName}
              helperText={
                invalidReportName ? 'Report Name can not be empty' : ''
              }
            />
          </Box>
          <Box
            width={'100%'}
            sx={{
              display: 'flex',
              justifyContent: 'right',
            }}
          >
            <FormControl variant="standard">
              <FormControlLabel
                value="betaIcon"
                control={<Checkbox />}
                label="Beta Icon"
                labelPlacement="start"
                onChange={onChangeIconHandler}
                checked={report.beta ? report.beta : false}
                sx={{
                  margin: '0px',
                  marginTop: '10px',
                }}
              />
            </FormControl>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={invalidReportName}
          onClick={() => {
            props.handleUpadteReportName(report);
          }}
          autoFocus
          data-testid="save"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReportName;
