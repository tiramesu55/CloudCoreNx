/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-no-useless-fragment */

//@TODO get rid of OKTA
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { UserForm } from '../features/users/userForm';
import { AddUserForm as UserEmail } from '../features/users/userEmail';
import { Dashboard } from '../Dashboard/dashboard';
import { OrganizationForm as AddNewOrganisation } from '../features/organizations/OrganisationForm';
import UserOnboarding from '../features/users/userOnboardingForm';
import {
  IdlePopUp,
  Header,
  NotAuthorized,
  Backdrop,
  nexia_logo_img,
  sign_out_img,
  Snackbar,
  UnsavedData,
  DisplayMaintenance,
} from '@cloudcore/ui-shared';
import { ListUsers } from '../features/users/allUsers';
import {
  bypassUserAsync,
  getApplications,
  getMaintenanceAsync,
  platformStore,
  selectAppRoles,
  closeAlertAction,
  openAlertAction,
  getPostLogoutRedirectUrl,
} from '@cloudcore/redux-store';
import { SiteForm } from '../features/sites/siteForm';
import { Sites } from '../features/sites/sites';
import {
  ConfigCtx,
  IConfig,
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import SuiteManagement from '../features/suiteManagement/suiteManagement';
import EditMaintenanceMode from '../Maintenance/editMaintenance';
import { IAlert } from '@cloudcore/common-lib';
import { useMaintenance, IAppsMenu } from '@cloudcore/common-lib';

const { useAppDispatch, useAppSelector } = platformStore;

interface Props {
  appsMenu?: IAppsMenu;
}

export const Routes = (props: Props) => {
  const handleOpenAlert = (payload: IAlert) =>
    dispatch(openAlertAction(payload));
  const handleCloseAlert = () => dispatch(closeAlertAction());
  const { openAlert, type, content } = useAppSelector((state) => state.common);
  const config: IConfig = useContext(ConfigCtx)!;
  const disableBackDrop = false;

  const orgFormModified = useAppSelector(
    (state) => state.organizations.orgFormModified
  );
  const loggedInOrgCode = useAppSelector((state) => state.maintenance.orgCode);
  const userFormModified = useAppSelector(
    (state) => state.user.userFormModified
  );

  const orgCode = useAppSelector(
    (state) => state.organizations.organization.orgCode
  );
  const siteFormModified = useAppSelector(
    (state) => state.sites.siteFormModified
  );
  const suiteFormModified = useAppSelector(
    (state) => state.suiteManagement.suiteFormModified
  );
  const orgLoadingState = useAppSelector(
    (state) => state.organizations.status === 'loading'
  );

  const dashboardLoadingState = useAppSelector(
    (state) => state.dashboard.status === 'loading'
  );

  const siteLoadingState = useAppSelector(
    (state) => state.sites.status === 'loading'
  );

  const userLoadingState = useAppSelector(
    (state) => state.user.status === 'loading'
  );

  const applicationLoadingState = useAppSelector(
    (state) => state.applications.status === 'loading'
  );

  const backDrop = () => {
    const x =
      disableBackDrop === false
        ? orgLoadingState ||
          userLoadingState ||
          dashboardLoadingState ||
          siteLoadingState ||
          applicationLoadingState ||
          (!loadData && !disableBackdrop)
        : false;
    return x;
  };
  const { signOut, token, initials, names, permissions, email } =
    useClaimsAndSignout() as UseClaimsAndSignout;

  const platformPermissions = (permissions.get('admin') ?? []).length > 0;

  const dispatch = useAppDispatch();
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const history = useHistory();
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [modifiedDataLogout, setModifiedDataLogout] = useState(false);
  const [modifiedDataApp, setModifiedDataApp] = useState(false);

  const [appSwitchUrl, setAppSwitchUrl] = useState('');
  const allApps = useAppSelector(selectAppRoles).map((app) => {
    return {
      appCode: app.appCode,
      name: app.name,
    };
  });
  const adminRightsEnabled = (permissions.get('admin') ?? []).includes(
    'global'
  );

  const currentDate = new Date();

  const {
    displayMaintenance,
    underMaintenance,
    maintenanceStartDate,
    maintenanceEndDate,
    maintenanceReason,
    fullLockout,
    handleDisplayMaintenanceDialog,
    isBypassUser,
    loadData,
    disableBackdrop,
  } = useMaintenance('Platform Management', currentDate);

  const handleDialogBox = (open: boolean) => {
    setDialogBoxOpen(open);
  };

  const handleMaintenanceDialog = (value: boolean) => {
    setMaintenanceDialogOpen(value);
  };

  useEffect(() => {
    if (platformBaseUrl) {
      dispatch(
        getApplications({
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            //Do Nothing
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
      dispatch(
        getMaintenanceAsync({
          url: platformBaseUrl,
          token: token,
        })
      );
      dispatch(
        bypassUserAsync({
          url: platformBaseUrl,
          token: token,
          email: email,
        })
      );
    }
  }, [platformBaseUrl, token]);

  useEffect(() => {
    if (platformBaseUrl && loggedInOrgCode) {
      dispatch(
        getPostLogoutRedirectUrl({
          orgCode: loggedInOrgCode,
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            //Do Nothing
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    }
  }, [loggedInOrgCode, platformBaseUrl, token, orgCode]);

  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);

  const ComponentLayout = (Component: any) => {
    return (
      <>
        <Backdrop open={backDrop()} />
        <EditMaintenanceMode
          open={maintenanceDialogOpen}
          handleClose={handleMaintenanceDialog}
          allApps={allApps}
        />
        <DisplayMaintenance
          open={displayMaintenance}
          underMaintenance={underMaintenance}
          handleDisplayMaintenanceDialog={handleDisplayMaintenanceDialog}
          maintenanceStartDate={maintenanceStartDate}
          maintenanceEndDate={maintenanceEndDate}
          maintenanceReason={maintenanceReason}
          fullLockout={fullLockout}
          bypassUser={isBypassUser}
          mainApp={config.isMainApp}
          logout={() => signOut()}
        />
        {HeaderPlatform}
        {loadData && (
          <Component
            handleOpenAlert={handleOpenAlert}
            handleCloseAlert={handleCloseAlert}
            alertData={{
              openAlert,
              type,
              content,
            }}
          />
        )}
      </>
    );
  };

  const HeaderPlatform = useMemo(() => {
    const formModified =
      orgFormModified === true ||
      siteFormModified === true ||
      userFormModified === true ||
      suiteFormModified === true;

    const handleUnSavedDataDialogue = (open: boolean, app: string) => {
      setDialogBoxOpen(open);
      setModifiedDataApp(open);
      setAppSwitchUrl(app);
    };

    const handleLogout = () => {
      if (formModified) {
        setModifiedDataLogout(true);
        setDialogBoxOpen(true);
      } else {
        signOut();
      }
    };

    const handleNavigation = (
      e: React.MouseEvent<HTMLElement>,
      loc: string
    ) => {
      e.preventDefault();
      if (formModified) {
        setDialogBoxOpen(true);
        setRedirectUrl(loc);
        setModifiedDataLogout(false);
      } else {
        loc === 'dashboard' && history.push(`${path}`);
        loc === 'users' && history.push(`${path}user`);
        loc === 'suiteManagement' && history.push(`${path}suiteManagement`);
        setModifiedDataLogout(false);
      }
    };

    const availablePages = [
      {
        label: 'Dashboard',
        route: path,
        onClick: (e: React.MouseEvent<HTMLElement>) =>
          handleNavigation(e, 'dashboard'),
      },
      {
        label: 'Users',
        route: `${path}user`,
        onClick: (e: React.MouseEvent<HTMLElement>) =>
          handleNavigation(e, 'users'),
      },
      {
        label: 'Suite Management',
        route: `${path}suiteManagement`,
        onClick: (e: React.MouseEvent<HTMLElement>) =>
          handleNavigation(e, 'suiteManagement'),
      },
    ];

    const hideSuiteManagement = availablePages.filter(
      (el) => el.label !== 'Suite Management'
    );

    const resetAppSwitch = () => {
      setModifiedDataApp(false);
      setAppSwitchUrl('');
    };

    const navList =
      loadData === false
        ? []
        : adminRightsEnabled
        ? availablePages
        : hideSuiteManagement;
    return (
      <>
        {' '}
        <Snackbar
          open={openAlert}
          type={type}
          content={content}
          onClose={handleCloseAlert}
          duration={3000}
        />
        <UnsavedData
          open={dialogBoxOpen}
          location={
            modifiedDataLogout
              ? 'logout'
              : modifiedDataApp
              ? 'appSwitch'
              : redirectUrl
          }
          handleLeave={handleDialogBox}
          appSwitchUrl={appSwitchUrl}
          resetAppSwitch={resetAppSwitch}
        />
        <IdlePopUp
          logOut={signOut}
          minutes={5}
          seconds={0}
          timer={{ minutes: 5, seconds: 0 }}
        />
        <Header
          title={'Platform Management'}
          logo={{ img: nexia_logo_img, path: path }}
          betaIcon={true}
          reportIssue={false}
          navLinkMenuList={navList}
          isFormModified={formModified}
          userMenu={{
            userName: names ? names[0] + ' ' + names[1] : '',
            userInitials: initials!,
          }}
          userMenuList={[
            {
              icon: sign_out_img,
              label: 'Logout',
              onClick: () => handleLogout(),
            },
          ]}
          maintenance={{
            showMaintenance: adminRightsEnabled,
            handleMaintenanceDialog,
          }}
          unSavedData={handleUnSavedDataDialogue}
          appsMenu={props.appsMenu}
        />
      </>
    );
  }, [
    adminRightsEnabled,
    appSwitchUrl,
    content,
    dialogBoxOpen,
    handleCloseAlert,
    initials,
    loadData,
    modifiedDataApp,
    modifiedDataLogout,
    names,
    openAlert,
    path,
    props.appsMenu,
    redirectUrl,
    signOut,
    type,
  ]);

  return (
    <>
      {platformPermissions ? (
        <>
          <Route exact path={`${path}`}>
            {ComponentLayout(Dashboard)}
          </Route>
          <Route exact path={`${path}user`}>
            {ComponentLayout(ListUsers)}
          </Route>
          <Route path={`${path}organization/addOrganization`}>
            {ComponentLayout(AddNewOrganisation)}
          </Route>
          <Route path={`${path}organization/editOrganization`}>
            {ComponentLayout(AddNewOrganisation)}
          </Route>

          <Route path={`${path}user/email`}>{ComponentLayout(UserEmail)}</Route>
          <Route path={`${path}user/addUser`}>
            {ComponentLayout(UserForm)}
          </Route>
          <Route path={`${path}user/editUser`}>
            {ComponentLayout(UserForm)}
          </Route>
          <Route path={`${path}user/onboarding`}>
            {ComponentLayout(UserOnboarding)}
          </Route>
          <Route path={`${path}organization/sites`}>
            {ComponentLayout(Sites)}
          </Route>
          <Route path={`${path}organization/editSite`}>
            {ComponentLayout(SiteForm)}
          </Route>
          <Route path={`${path}organization/addSite`}>
            {ComponentLayout(SiteForm)}
          </Route>
          <Route path={`${path}organization/editOrg/addSite`}>
            {ComponentLayout(SiteForm)}
          </Route>
          {adminRightsEnabled && (
            <Route path={`${path}suiteManagement`}>
              {ComponentLayout(SuiteManagement)}
            </Route>
          )}
        </>
      ) : (
        <Route path={path}>
          <NotAuthorized signOut={signOut} />
        </Route>
      )}
    </>
  );
};
