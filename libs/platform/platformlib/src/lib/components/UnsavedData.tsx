import { useHistory, useLocation } from 'react-router-dom';
import {
  DialogActions,
  DialogContent,
  Button,
  Dialog,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material';
import warningImg from '../images/warning.png';
import {
  setOrgFormModified,
  setSiteFormModified,
  setUserFormModified,
  platformStore,
} from '@cloudcore/redux-store';

interface Props {
  open: boolean;
  handleLeave: (open: boolean) => void;
  location?: string;
}

export const UnsavedData = (props: Props) => {
  const theme = useTheme();
  const { useAppDispatch } = platformStore;
  const history = useHistory();
  const location: any = useLocation();
  const dispatch = useAppDispatch();

  const handleStay = () => {
    props.handleLeave(false);
  };

  const orgData = {
    orgCode: location?.state?.orgCode,
    orgName: location?.state?.orgName,
  };

  const currentPage = location?.state?.currentPage;
  const rowsPerPage = location?.state?.rowsPerPage;

  const handleLeave = () => {
    props.handleLeave(false);
    if (props.location === 'users') {
      history.push('/user', {
        currentPage: currentPage,
        rowsPerPage: rowsPerPage,
      });
      dispatch(setOrgFormModified(false));
      dispatch(setSiteFormModified(false));
      dispatch(setUserFormModified(false));
    } else if (props.location === 'dashboard') {
      history.push('/');
      dispatch(setOrgFormModified(false));
      dispatch(setSiteFormModified(false));
      dispatch(setUserFormModified(false));
    } else if (props.location === 'organization') {
      history.push('/');
      dispatch(setOrgFormModified(false));
    } else if (props.location === 'site') {
      history.push('/organization/sites', {
        from: 'siteForm',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
      dispatch(setSiteFormModified(false));
    } else if (props.location === 'organizationForm') {
      history.push('/organization/editOrganization', {
        from: 'siteForm',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
      dispatch(setSiteFormModified(false));
    } else {
      history.goBack();
    }
  };

  return (
    <div>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            width: '20%',
            maxHeight: 435,
            border: `2px solid red`,
            borderTop: `10px solid red`,
          },
        }}
        open={props.open}
        onClose={handleStay}
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
              Are you sure you want to go back? Unsaved changes will be lost!
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
            onClick={handleStay}
            sx={{ marginRight: theme.spacing(2) }}
            variant="outlined"
          >
            Stay
          </Button>
          <Button
            onClick={handleLeave}
            variant="contained"
            color="error"
            sx={{ color: 'white', borderRadius: '5px' }}
            autoFocus
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
