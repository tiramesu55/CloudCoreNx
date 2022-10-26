import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Button,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import timerIcon from '../assets/timer-icon.svg';
import { CountDownTimer } from './countDown-timer';

interface IdlePopUpProps {
  open: boolean;
  onActive: () => void;
  logOut?: () => void;
  minutes?: number;
  seconds: number;
  timer: { minutes: number; seconds: number };
}

export const IdlePopUp = ({
  open,
  onActive,
  logOut,
  minutes,
  seconds,
  timer,
}: IdlePopUpProps) => {
  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth="md"
      transitionDuration={0}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Box>
          <Typography component="span" variant="h5" fontWeight={'bold'}>
            Session Timeout
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#000000',
              }}
              onClick={onActive}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={5}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={timerIcon}
              alt="timer icon"
              style={{ paddingRight: '19px' }}
            />
            <Typography
              fontSize={'18px'}
              fontWeight={'bold'}
              sx={{ color: '#000000' }}
            >
              Your online session will expire in
            </Typography>
          </Box>
          <CountDownTimer minutes={minutes} seconds={seconds} timer={timer} />
          <Typography fontSize={'18px'} sx={{ color: '#000000' }}>
            Please click "Continue" to keep working or click "Log Off" to end
            your session now.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '16px' }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: 'full',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '25px',
            paddingRight: '25px',
            fontSize: '16px',
            color: '#8141F2',
            borderColor: '#8141F2',
            '&:hover': {
              background: '#6513F0',
              color: '#ffffff',
              border: '1px solid #ffffff',
            },
          }}
          onClick={logOut}
        >
          LOG OFF
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: 'full',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '25px',
            paddingRight: '25px',
            fontSize: '16px',
            backgroundColor: '#8141F2',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#6513F0',
            },
          }}
          onClick={onActive}
        >
          CONTINUE
        </Button>
      </DialogActions>
    </Dialog>
  );
};
