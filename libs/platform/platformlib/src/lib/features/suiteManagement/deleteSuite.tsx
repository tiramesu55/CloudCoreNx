import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { deleteSuiteAsync, getSuitesAsync, platformStore, setSelectedPermission, setSelectedSuiteId, setSelectedSuiteName, setSuiteFormModified } from '@cloudcore/redux-store';
import { ConfigCtx, UseClaimsAndSignout, useClaimsAndSignout } from '@cloudcore/okta-and-config';
import { useContext } from 'react';
import { IAlert, IAlertData } from '@cloudcore/common-lib';

interface Props {
  open: boolean;
  handleLeave: (open: boolean) => void;
  suiteName: string;
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
  selectedDomain : string;
}

const { useAppDispatch, useAppSelector } = platformStore;

const DeleteSuite = (props: Props) => {
  const theme = useTheme();
  const selectedSuiteName = useAppSelector((state) => state.suiteManagement.selectedSuiteName);
  const selectedSuiteId = useAppSelector((state) => state.suiteManagement.selectedSuiteId);
  const { token } = useClaimsAndSignout() as UseClaimsAndSignout;
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    props.handleLeave(false);
  };

  const handleDelete = () => {
    try {
      props.handleLeave(false);
      dispatch(
        deleteSuiteAsync({
          token,
          url: platformBaseUrl,
          id: selectedSuiteId,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            props.handleOpenAlert({
              content: 'Suite deleted successfully',
              type: 'success',
            });
            dispatch(setSuiteFormModified(false));
            if (token && props.selectedDomain !== '') {
              dispatch(
                getSuitesAsync({
                  token,
                  url: platformBaseUrl,
                  domain: props.selectedDomain,
                })
              )
                .unwrap()
                .then(
                  (value: any) => {
                    dispatch(setSelectedSuiteName(''));
                    dispatch(setSelectedSuiteId(''));
                  },
                  (reason: any) => {
                    props.handleOpenAlert({
                      content: reason.message,
                      type: 'error',
                    });
                  }
                );
            }
          },
          (reason: any) => {
            props.handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
      dispatch(setSelectedPermission(''))
    } catch (err) {
      console.log('failed to delete suite', err);
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
      >
        <DialogTitle id="alert-dialog-title">
          <Box>
            <Typography
              component="span"
              variant="h4"
              fontWeight={'bold'}
              sx={{ color: `${theme.palette.blackFont.main}` }}
            >
              Delete Selected Suite
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
          <DialogContentText id="alert-dialog-description" component={"div"}>
            <Box
              color={theme.palette.blackFont.main}
              fontSize={'32px'}
              my={6}
              fontWeight={400}
            >
              {`We will delete "${selectedSuiteName}" Suite.`}
            </Box>
            <Box
              color={theme.palette.blackFont.main}
              fontSize={theme.typography.body2.fontSize}
            >
              Please click "Cancel" to go back or click "Delete" to delete
              selected suite
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteSuite;
