/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Typography, Grid, Divider, useTheme } from '@mui/material';
import { platformStore } from '@cloudcore/redux-store';
import React, { useContext, useEffect, useState } from 'react';
import { Snackbar } from '@cloudcore/ui-shared';
import { CustomMultiSelectBox } from '../../components/custom-multi-select-box/custom-multi-select-box';
import {
  currentApps,
  updatePartialApp,
  updatePartialSite,
  PartialApplication,
  PartialSite,
  setUserFormModified,
  selectAllSites,
  getSites,
  checkIfRootOrganization,
  selectAppRoles,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

interface Props {
  orgCode: string;
  modifiedData: (modifiedData: boolean) => void;
}

const { useAppDispatch, useAppSelector } = platformStore;
export interface Option {
  name: string;
  value: string;
  permissions?: string[]; // this is for permissions
}

export const SelectSites = (props: Props) => {
  const config: IConfig = useContext(ConfigCtx)!;
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const dispatch = useAppDispatch();
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');
  //allApps below returns an array of {appCode, roles[]} where roles is an array of Role. It will be easier to go over all apps in a loop
  const allApps = useAppSelector(selectAppRoles);
  //selectedApps below are from the user. for new user it is empty.  See the state.applications section of the state
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const selectedApps = useAppSelector(currentApps);
  const allSites = useAppSelector(selectAllSites);
  const root = useAppSelector((state) =>
    checkIfRootOrganization(state, props.orgCode)
  );
  const [loadSite, setLoadSite] = useState(false);

  //function that filters sites based on appCode and subscription
  const appSites = (app: string): { name: string; value: string }[] => {
    const rawSites =
      allSites !== null
        ? allSites.filter((p) =>
            p.applications.map((x) => x.appCode).includes(app)
          )
        : [];
    const rtn = rawSites.map((p) => ({ name: p.siteName, value: p.id! }));
    return rtn;
  };

  const appChange = (appCode: string, entity: string, updated: Option[]) => {
    //todo updated shouldn't be a string[]. it should be an array of objects
    if (entity === 'Roles') {
      const payload: PartialApplication = {
        appCode: appCode,
        roles: updated.map((p) => ({
          role: p.name,
          permissions:
            p.permissions === null || p.permissions === undefined
              ? []
              : p.permissions,
        })),
      };
      dispatch(updatePartialApp(payload));
    } else {
      //sites
      const payload: PartialSite = {
        appCode: appCode,
        sites: updated.map((p) => ({ siteCode: p.name, siteId: p.value })),
      }; //updated should be an array of proper objects
      dispatch(updatePartialSite(payload));
    }
    dispatch(setUserFormModified(true));
    // props.modifiedData(true);
    //  dispatch(updateApplications(selection));
  };

  useEffect(() => {
    if (props.orgCode !== '') {
      dispatch(
        getSites({
          orgCode: props.orgCode,
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            setLoadSite(true);
          },
          (reason: any) => {
            setLoadSite(false);
            setSnackbar(true);
            setSnackBarMsg('fetchError');
            setSnackBarType('failure');
          }
        );
    }
  }, [platformBaseUrl, dispatch, props.orgCode, token]);
  const theme = useTheme();

  return (
    <>
      <Grid container item xs={12} mt={5}>
        {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
        <Grid item xs={2}>
          <Typography
            fontSize={theme.typography.subtitle1.fontSize}
            fontWeight="bold"
            color={theme.palette.blackFont.main}
          >
            Applications
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            fontSize={theme.typography.subtitle1.fontSize}
            fontWeight="bold"
            color={theme.palette.blackFont.main}
          >
            Roles
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            fontSize={theme.typography.subtitle1.fontSize}
            fontWeight="bold"
            color={theme.palette.blackFont.main}
          >
            Sites
          </Typography>
        </Grid>
      </Grid>
      {allApps !== null &&
        props.orgCode !== '' &&
        allApps.map((appDetail) => {
          const justRoles: Option[] = [];
          if (appDetail.appCode === 'admin') {
            appDetail.roles.forEach((roles) => {
              if (
                (!root && roles.role === 'organization') ||
                (root && roles.role === 'admin')
              ) {
                justRoles.push({
                  name: roles.role,
                  value: roles.role,
                  permissions: roles.permissions,
                });
              }
            });
          } else {
            appDetail.roles.forEach((roles) => {
              justRoles.push({
                name: roles.role,
                value: roles.role,
                permissions: roles.permissions,
              });
            });
          }

          //Roles and Sites are returned for the particular application
          const application =
            selectedApps &&
            selectedApps.find(
              (p) =>
                p?.appCode.toLowerCase() === appDetail.appCode.toLowerCase()
            );

          const selectedSites =
            application && application.sites
              ? application.sites.map((x) => ({
                  name: x.siteCode,
                  value: x.siteId,
                }))
              : [];

          const selectedAppRoles =
            application && application.roles
              ? application.roles.map((x) => ({
                  name: x.role,
                  value: x.role,
                  permissions: x.permissions,
                }))
              : [];

          return (
            <React.Fragment key={appDetail.appCode}>
              <Divider
                sx={{
                  paddingY: theme.spacing(0.5),
                  borderColor: theme.palette.cardBorder.main,
                }}
              />
              <Grid container item xs={12} mt={2}>
                <Grid item xs={2}>
                  {appDetail.name}
                </Grid>
                <Grid item xs={4}>
                  <CustomMultiSelectBox
                    application={appDetail.appCode}
                    inputList={selectedAppRoles}
                    totalList={justRoles}
                    customSelectLabel="Roles"
                    handleChange={appChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  {allSites.length > 0 &&
                    appDetail.appCode !== 'admin' &&
                    loadSite && (
                      <CustomMultiSelectBox
                        application={appDetail.appCode}
                        inputList={selectedSites}
                        totalList={appSites(appDetail.appCode)}
                        customSelectLabel="Sites"
                        handleChange={appChange}
                      />
                    )}
                </Grid>
              </Grid>
            </React.Fragment>
          );
        })}
    </>
  );
};
