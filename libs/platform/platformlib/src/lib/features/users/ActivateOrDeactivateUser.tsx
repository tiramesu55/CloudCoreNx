/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useContext } from 'react';
import { platformStore } from '@cloudcore/redux-store';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Dialog,
  Box,
  Typography,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { useTheme } from '@mui/material';
import warningImg from '../../images/warning.png';
import {
  selectedUserEmail,
  selectUserByIdEntity,
  deleteUser,
  updateUser,
  User,
} from '@cloudcore/redux-store';
import { ConfigCtx } from '@cloudcore/okta-and-config';
import { useOktaAuth } from '@okta/okta-react';

interface Props {
  user: User | undefined;
  setActiveDate: (value: Date | null) => void;
  setSnackbar: (value: boolean) => void;
  setSnackBarType: (value: string) => void;
  setSnackBarMsg: (value: string) => void;
}

const {useAppDispatch, useAppSelector } = platformStore
export const DeactivateUser = (props: Props) => {
  const theme = useTheme();
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const dispatch = useAppDispatch();

  const { authState } = useOktaAuth();
  const history = useHistory();
  const selectedId: string = useAppSelector(selectedUserEmail);
  const [open, setOpen] = useState(false);
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const user = useAppSelector(selectUserByIdEntity(selectedId));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeactivate = () => {
    setOpen(false);

    try {
      setAddRequestStatus('pending');
      dispatch(
        deleteUser({
          user: user!,
          url: platformBaseUrl,
          token: authState?.accessToken?.accessToken,
        })
      )
        .unwrap()
        .then(
          (value) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('editUserSuccess');
            props.setSnackBarType('success');

            setTimeout(() => {
              history.push('/user');
            }, 1000);
          },
          (reason) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('editUserFailure');
            props.setSnackBarType('failure');
          }
        );
    } catch (err) {
      console.error('Failed to save the user', err);
    } finally {
      setAddRequestStatus('idle');
    }
  };

  const handleActivate = () => {
    setOpen(false);
    try {
      setAddRequestStatus('pending');
      props.setActiveDate(null);
      dispatch(
        updateUser({
          user: props.user!,
          url: platformBaseUrl,
          token: authState?.accessToken?.accessToken,
        })
      )
        .unwrap()
        .then(
          (value) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('editUserSuccess');
            props.setSnackBarType('success');

            setTimeout(() => {
              history.push('/user');
            }, 1000);
          },
          (reason) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('editUserFailure');
            props.setSnackBarType('failure');
          }
        );
    } catch (err) {
      console.error('Failed to save the user', err);
    } finally {
      setAddRequestStatus('idle');
    }
  };

  return (
    <div>
      <Button
        variant="text"
        disableRipple={true}
        sx={{
          color: theme.palette.primary.main,
          textTransform: 'capitalize',
          fontSize: theme.typography.subtitle1.fontSize,
          fontWeight: 'bold',
        }}
        onClick={handleClickOpen}
      >
        {props.user?.inactiveDate === null ? (
          <>Deactivate User</>
        ) : (
          <>Activate User</>
        )}
      </Button>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            width: '20%',
            maxHeight: 435,
            border: `2px solid red`,
            borderTop: `10px solid red`,
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ paddingTop: '40px', paddingX: '0px' }}>
          <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
            <img src={warningImg} alt="warning" />
          </Box>
          <Box>
            <Typography
              component={'span'}
              variant="h5"
              fontWeight={'bold'}
              sx={{
                color: 'red',
                paddingTop: '20px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {'Warning'}
            </Typography>
          </Box>
          <Box>
            <Typography
              component={'span'}
              variant="subtitle2"
              color={theme.palette.blackFont.main}
              fontSize={theme.typography.subtitle1.fontSize}
              paddingX="40px"
              paddingTop={'20px'}
              display="flex"
              align="center"
            >
              Are you sure, Do you want to
              {props.user?.inactiveDate === null ||
              (props.user?.inactiveDate !== undefined &&
                new Date(props.user?.inactiveDate)) >= new Date() ? (
                <> Deactivate </>
              ) : (
                <> Activate </>
              )}
              the user {props.user?.firstName}?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '40px',
            paddingX: '0px',
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: `${theme.palette.greyButton.main} !important`,
              border: `1px solid ${theme.palette.greyButton.main} !important`,
              '&:hover': {
                color: `${theme.palette.greyButton.main} !important`,
                border: `1px solid ${theme.palette.greyButton.main} !important`,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={
              props.user?.inactiveDate === null
                ? handleDeactivate
                : handleActivate
            }
            variant="contained"
            color="error"
            sx={{ color: 'white', borderRadius: '5px' }}
            autoFocus
          >
            {props.user?.inactiveDate === null ? (
              <>Deactivate</>
            ) : (
              <>Activate</>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
