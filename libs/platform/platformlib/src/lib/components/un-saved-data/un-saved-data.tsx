import { useHistory, useLocation } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import {
  DialogActions,
  DialogContent,
  Button,
  Dialog,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material';
import warning_img from '../../../../../../ui-shared/src/lib/assets/warning.png';
import {
  setOrgFormModified,
  setSiteFormModified,
  setUserFormModified,
  platformStore,
  setSuiteFormModified,
  setResetForm,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

interface Props {
  open: boolean;
  handleLeave: (open: boolean) => void;
  location?: string;
}

export const UnsavedData = (props: Props) => {
  const config: IConfig = useContext(ConfigCtx)!;
  const { signOut } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
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
      history.push(`${path}user`, {
        currentPage: currentPage,
        rowsPerPage: rowsPerPage,
      });
      dispatch(setOrgFormModified(false));
      dispatch(setSiteFormModified(false));
      dispatch(setUserFormModified(false));
      dispatch(setSuiteFormModified(false));
      dispatch(setResetForm(true));
    } else if (props.location === 'dashboard') {
      history.push(path);
      dispatch(setOrgFormModified(false));
      dispatch(setSiteFormModified(false));
      dispatch(setUserFormModified(false));
      dispatch(setSuiteFormModified(false));
      dispatch(setResetForm(true));
    } else if (props.location === 'organization') {
      history.push(path);
      dispatch(setOrgFormModified(false));
    } else if (props.location === 'site') {
      history.push(`${path}organization/sites`, {
        from: 'siteForm',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
      dispatch(setSiteFormModified(false));
    } else if (props.location === 'organizationForm') {
      history.push(`${path}organization/editOrganization`, {
        from: 'siteForm',
        orgCode: orgData.orgCode,
        orgName: orgData.orgName,
      });
      dispatch(setSiteFormModified(false));
    } else if (props.location === 'customReports') {
      history.push(`${path}customReports`);
      dispatch(setOrgFormModified(false));
      dispatch(setSiteFormModified(false));
      dispatch(setUserFormModified(false));
      dispatch(setSuiteFormModified(false));
      dispatch(setResetForm(true));
    } else if (props.location === 'logout') {
      dispatch(setOrgFormModified(false));
      dispatch(setSiteFormModified(false));
      dispatch(setUserFormModified(false));
      dispatch(setSuiteFormModified(false));
      signOut();
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
              {props.location === 'logout'
                ? 'Are you sure you want to go logout? Unsaved changes will be lost!'
                : 'Are you sure you want to go back? Unsaved changes will be lost!'}
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
            {props.location === 'logout' ? 'Logout' : 'Leave'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
