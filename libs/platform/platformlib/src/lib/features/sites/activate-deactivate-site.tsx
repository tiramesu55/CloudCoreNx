/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material';
import warningImg from '../../images/warning.png';
import { platformStore } from '@cloudcore/redux-store';
import { useHistory, useLocation } from 'react-router-dom';
import {
  deleteSite,
  selectedSite,
  Site,
  updateSite,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

interface Props {
  setSnackbar: (value: boolean) => void;
  setSnackBarType: (value: string) => void;
  setSnackBarMsg: (value: string) => void;
  orgData: {
    orgCode: string;
    orgName: string;
  };
  disableEditApp: boolean;
}
const { useAppDispatch, useAppSelector } = platformStore;
export const ActivateDeactivateSite = (props: Props) => {
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const theme = useTheme();
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const [open, setOpen] = useState(false);
  const site = useAppSelector(selectedSite);
  const history = useHistory();
  const location: any = useLocation();
  const dispatch = useAppDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleActivate = () => {
    setOpen(false);
    try {
      const updatedSite: Site = {
        id: site.id,
        configPath: site.configPath,
        createdBy: null,
        createdDate: site.createdDate,
        description: site.description,
        endDate: null,
        inactiveDate: null,
        modifiedBy: null,
        modifiedDate: new Date(),
        orgCode: location.state.orgCode,
        phone: site.phone,
        serviceEmail: site.serviceEmail,
        siteCode: site.siteCode,
        siteIdentifier: site.siteIdentifier,
        siteManagers: [],
        siteName: site.siteName,
        startDate: null,
        address: {
          city: site.address.city,
          state: site.address.state,
          street: site.address.street,
          zip: site.address.zip,
        },
        applications: site.applications,
      };
      dispatch(
        updateSite({
          site: updatedSite,
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('successMsg');
            props.setSnackBarType('success');
            setTimeout(() => {
              history.push('/organization/sites', {
                from: 'siteForm',
                orgCode: props.orgData.orgCode,
                orgName: props.orgData.orgName,
              });
            }, 1000);
          },
          (reason: any) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('errorMsg');
            props.setSnackBarType('failure');
          }
        );
    } catch (err) {
      console.log('failed to activate Site', err);
    }
  };

  const handleDeactivate = () => {
    setOpen(false);
    try {
      dispatch(
        deleteSite({
          id: site?.id,
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('successMsg');
            props.setSnackBarType('success');
            setTimeout(() => {
              history.push('/organization/sites', {
                from: 'siteForm',
                orgCode: props.orgData.orgCode,
                orgName: props.orgData.orgName,
              });
            }, 1000);
          },
          (reason: any) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('errorMsg');
            props.setSnackBarType('failure');
          }
        );
    } catch (err) {
      console.log('faild to deactivate Site', err);
    }
  };

  return (
    <div>
      <Button
        variant="text"
        disableRipple={true}
        disabled={props.disableEditApp}
        sx={{
          color: theme.palette.primary.main,
          textTransform: 'capitalize',
          fontSize: theme.typography.subtitle1.fontSize,
          fontWeight: 'bold',
        }}
        onClick={handleClickOpen}
      >
        {site?.inactiveDate === null ? (
          <>Deactivate Site</>
        ) : (
          <>Activate Site</>
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
              {site?.inactiveDate === null ? (
                <> Deactivate </>
              ) : (
                <> Activate </>
              )}
              the Site {site?.siteName}?
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
              site?.inactiveDate === null ? handleDeactivate : handleActivate
            }
            variant="contained"
            color="error"
            sx={{ color: 'white', borderRadius: '5px' }}
            autoFocus
          >
            {site?.inactiveDate === null ? <>Deactivate</> : <>Activate</>}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
