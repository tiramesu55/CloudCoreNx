/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useContext, useMemo } from 'react';
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
import { warning_img } from '@cloudcore/ui-shared';
import {
  selectedUserEmail,
  selectUserByIdEntity,
  deleteUser,
  updateUser,
  User,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { IAlert } from '@cloudcore/common-lib';

interface Props {
  user: User | undefined;
  setActiveDate: (value: Date | null) => void;
  openAlert: (payload: IAlert) => void;
  closeAlert: () => void;
}

const { useAppDispatch, useAppSelector } = platformStore;
export const DeactivateUser = (props: Props) => {
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token } = useClaimsAndSignout() as UseClaimsAndSignout;

  const theme = useTheme();
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const dispatch = useAppDispatch();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [snackbarRouting, setSnackbarRouting] = useState(() => {
    return () => {
      return;
    };
  });

  const handleDeactivate = () => {
    setOpen(false);

    try {
      setAddRequestStatus('pending');
      dispatch(
        deleteUser({
          user: user!,
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value) => {
            props.openAlert({
              content: 'Changes were updated successfully',
              type: 'success',
            });
            setSnackbarRouting(history.push(`${path}user`));
          },
          (reason) => {
            props.openAlert({
              content: reason.message,
              type: 'error',
            });
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
          token: token,
        })
      )
        .unwrap()
        .then(
          (value) => {
            props.openAlert({
              content: 'Changes were updated successfully',
              type: 'success',
            });
            setSnackbarRouting(history.push(`${path}user`));
          },
          (reason) => {
            props.openAlert({
              content: reason.message,
              type: 'error',
            });
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
        data-testid="activeuser"
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
            <img src={warning_img} alt="warning" />
          </Box>
          <Box>
            <Typography
              component={'span'}
              variant="h6"
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
export default DeactivateUser;