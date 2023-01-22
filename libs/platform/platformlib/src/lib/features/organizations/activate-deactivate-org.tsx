/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useMemo, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material';
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
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { warning_img } from '@cloudcore/ui-shared';
import { IAlert } from '@cloudcore/common-lib';

interface Props {
  orgDomain: string;
  openAlert: (payload: IAlert) => void;
  closeAlert: () => void;
  orgData: {
    orgCode: string;
    orgName: string;
  };
}

const { useAppDispatch, useAppSelector } = platformStore;

export const ActivateDeactivateOrg = (props: Props) => {
  const config: IConfig = useContext(ConfigCtx) as IConfig; // at this point config is not null (see app)
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token } = useClaimsAndSignout() as UseClaimsAndSignout;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [snackbarRouting, setSnackbarRouting] = useState(() => {
    return () => {
      return;
    };
  });

  const handleActivate = () => {
    setOpen(false);
    try {
      const updatedOrganization: Organization = {
        name: organization.name,
        id: organization.id,
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
        postLogoutRedirectUrl: organization.postLogoutRedirectUrl,
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
            props.openAlert({
              content: 'Changes were updated successfully',
              type: 'success',
            });
            setSnackbarRouting(history.push(path));
          },
          (reason) => {
            props.openAlert({
              content: reason.message,
              type: 'error',
            });
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
            props.openAlert({
              content: 'Changes were updated successfully',
              type: 'success',
            });
            setSnackbarRouting(history.push(path));
          },
          (reason) => {
            props.openAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    } catch (err) {
      console.log('failed to deactivate organization', err);
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
export default ActivateDeactivateOrg;