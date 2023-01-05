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
import { ConfigCtx } from '@cloudcore/okta-and-config';
import { IAlert, IAlertData } from '@cloudcore/common-lib';

import { useOktaAuth } from '@cloudcore/okta-and-config';

interface Props {
  orgCode: string;
  modifiedData: (modifiedData: boolean) => void;
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}

const { useAppDispatch, useAppSelector } = platformStore;
export interface Option {
  name: string;
  value: string;
  permissions?: string[]; // this is for permissions
}

export const SelectSites = (props: Props) => {
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  const { oktaAuth } = useOktaAuth();
  const token = oktaAuth?.getAccessToken(); // useClaimsAndSignout() as UseClaimsAndSignout ;
  const dispatch = useAppDispatch();
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
    const rawSites = allSites
      ? allSites.filter(
          (p) =>
            p.applications && p.applications.map((x) => x.appCode).includes(app)
        )
      : [];
    const rtn = rawSites.map((p) => ({
      name: p.siteName,
      value: p.id!,
      code: p.siteCode,
    }));
    return rtn;
  };

  const appChange = (appCode: string, entity: string, updated: any[]) => {
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
        sites: updated.map((p) => ({ siteCode: p.code, siteId: p.value })),
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
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    }
  }, [platformBaseUrl, dispatch, props.orgCode, token]);
  const theme = useTheme();

  return (
    <>
      <Grid container item xs={12} mt={3}>
        <Snackbar
          open={alertData.openAlert}
          type={alertData.type}
          content={alertData.content}
          onClose={handleCloseAlert}
          duration={3000}
        />
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
      {allApps &&
        props.orgCode !== '' &&
        allApps.map((appDetail) => {
          const justRoles: Option[] = [];
          if (appDetail.roles) {
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
          }
          //Roles and Sites are returned for the particular application
          const application =
            selectedApps &&
            selectedApps.find(
              (p) =>
                p?.appCode.toLowerCase() === appDetail.appCode.toLowerCase()
            );

          const selectedSitesCode =
            application && application.sites
              ? application.sites.map((site) => site.siteCode)
              : [];

          const selectedSites = allSites
            .filter((site) => selectedSitesCode.indexOf(site.siteCode) > -1)
            .map((site) => ({ name: site.siteName, value: site.id }));

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
