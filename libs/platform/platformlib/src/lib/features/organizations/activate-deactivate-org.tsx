/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useState } from 'react';
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
import {
  deleteOrganizationAsync,
  selectedOrganization,
  Organization,
  updateOrganizationAsync,
} from '@cloudcore/redux-store';
import { useHistory } from 'react-router-dom';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

interface Props {
  orgDomain: string;
  setSnackbar: (value: boolean) => void;
  setSnackBarType: (value: string) => void;
  setSnackBarMsg: (value: string) => void;
}

const { useAppDispatch, useAppSelector } = platformStore;

export const ActivateDeactivateOrg = (props: Props) => {
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const organization = useAppSelector(selectedOrganization);
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const history = useHistory();
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
      const updatedOrganization: Organization = {
        name: organization.name,
        id: organization.orgCode,
        description: organization.description,
        orgCode: organization.orgCode,
        address: {
          street: organization.address.street,
          city: organization.address.city,
          state: organization.address.state,
          zip: organization.address.zip,
        },
        orgDomains: [props.orgDomain],
        root: organization.root,
        orgAdmins: [],
        inactiveDate: null,
        officeEmail: organization.officeEmail,
        officePhone: organization.officePhone,
        createdDate: new Date(),
        modifiedDate: new Date(),
        createdBy: null,
        modifiedBy: null,
        childOrgs: [],
      };
      dispatch(
        updateOrganizationAsync({
          organization: updatedOrganization,
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('editOrganizationSuccess');
            props.setSnackBarType('success');
            setTimeout(() => {
              history.push('/');
            }, 1000);
          },
          (reason) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('editOrganizationFailure');
            props.setSnackBarType('failure');
          }
        );
    } catch (err) {
      console.log('failed to activate organization', err);
    }
  };

  const handleDeactivate = () => {
    setOpen(false);
    try {
      dispatch(
        deleteOrganizationAsync({
          orgCode: organization?.orgCode,
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('editOrganizationSuccess');
            props.setSnackBarType('success');
            setTimeout(() => {
              history.push('/');
            }, 1000);
          },
          (reason) => {
            props.setSnackbar(true);
            props.setSnackBarMsg('editOrganizationFailure');
            props.setSnackBarType('failure');
          }
        );
    } catch (err) {
      console.log('faild to deactivate organization', err);
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
        {organization?.inactiveDate === null ? (
          <>Deactivate Organization</>
        ) : (
          <>Activate Organization</>
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
              {organization?.inactiveDate === null ? (
                <> Deactivate </>
              ) : (
                <> Activate </>
              )}
              the organization {organization?.name}?
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
              organization?.inactiveDate === null
                ? handleDeactivate
                : handleActivate
            }
            variant="contained"
            color="error"
            sx={{ color: 'white', borderRadius: '5px' }}
            autoFocus
          >
            {organization?.inactiveDate === null ? (
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
