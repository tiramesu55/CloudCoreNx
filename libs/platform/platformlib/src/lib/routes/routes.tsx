/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-no-useless-fragment */

//@TODO get rid of OKTA
import { useState, useEffect, useContext, useMemo } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { UserForm } from '../features/users/userForm';
import { AddUserForm as UserEmail } from '../features/users/userEmail';
import { Dashboard } from '../Dashboard/dashboard';
import { OrganizationForm as AddNewOrganisation } from '../features/organizations/OrganisationForm';
import UserOnboarding from '../features/users/userOnboardingForm';
import {
  Snackbar,
  IdlePopUp,
  Header,
  NotAuthorized,
  Backdrop,
} from '@cloudcore/ui-shared';
import { ListUsers } from '../features/users/allUsers';
import { getOrganizationsAsync, platformStore } from '@cloudcore/redux-store';
import { SiteForm } from '../features/sites/siteForm';
import { Sites } from '../features/sites/sites';
import { nexia_logo_img } from '@cloudcore/ui-shared';
import { sign_out_img } from '@cloudcore/ui-shared';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import CustomReports from '../features/customReports/customReports';
import { UnsavedData } from '../components';
import { useIdleTimer } from 'react-idle-timer';

const { useAppDispatch, useAppSelector } = platformStore;

export const Routes = () => {
  const config: IConfig = useContext(ConfigCtx)!;
  const [disableBackDrop, setDisableBackDrop] = useState(false);
  const handleDisableBackDrop: any = (value: boolean) => {
    setDisableBackDrop(value);
  };
  const orgFormModified = useAppSelector(
    (state) => state.organizations.orgFormModified
  );
  const userFormModified = useAppSelector(
    (state) => state.user.userFormModified
  );
  const siteFormModified = useAppSelector(
    (state) => state.sites.siteFormModified
  );
  const suiteFormModified = useAppSelector(
    (state) => state.customReports.suiteFormModified
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

  const backDrop: any =
    disableBackDrop === false
      ? orgLoadingState ||
        userLoadingState ||
        dashboardLoadingState ||
        siteLoadingState ||
        applicationLoadingState
      : false;

  const { signOut, token, initials, names, permissions } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );

  const platformPermissions =
    permissions?.admin && permissions?.admin.length > 0;

  const dispatch = useAppDispatch();
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const history = useHistory();
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const showCustomReports =
    permissions.admin && permissions.admin?.includes('global') ? true : false;

  const [activityModal, setActivityModal] = useState<boolean>(false);

  // Do some idle action like log out your user
  const onIdle = () => {
    signOut();
  };

  // Close Modal Prompt and reset the idleTimer
  const onActive = () => {
    setActivityModal(false);
    reset();
  };

  // opens modal prompt on timeout
  const onPrompt = () => {
    setActivityModal(true);
  };

  const { reset } = useIdleTimer({
    timeout: 1000 * 1500,
    onIdle,
    onActive,
    debounce: 500,
    onPrompt,
    promptTimeout: 1000 * 299,
  });

  const handleDialogBox = (open: boolean) => {
    setDialogBoxOpen(open);
  };

  useEffect(() => {
    if (platformBaseUrl) {
      dispatch(
        getOrganizationsAsync({
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
            setSnackbar(true);
            setSnackBarMsg('fetchError');
            setSnackBarType('failure');
          }
        );
    }
  }, [dispatch, platformBaseUrl, token]);

  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);

  const ComponentLayout = (Component: any) => {
    return (
      <>
        {HeaderPlatform}
        <Component />
      </>
    );
  };

  const handleNavigation = (e: React.MouseEvent<HTMLElement>, loc: string) => {
    e.preventDefault();
    if (
      orgFormModified === true ||
      siteFormModified === true ||
      userFormModified === true ||
      suiteFormModified === true
    ) {
      setDialogBoxOpen(true);
      setRedirectUrl(loc);
    } else {
      loc === 'dashboard' && history.push(`${path}`);
      loc === 'users' && history.push(`${path}user`);
      loc === 'customReports' && history.push(`${path}customReports`);
    }
  };

  const navList = showCustomReports
    ? [
        {
          label: 'DASHBOARD',
          route: path,
          onClick: (e: React.MouseEvent<HTMLElement>) =>
            handleNavigation(e, 'dashboard'),
        },
        {
          label: 'USERS',
          route: `${path}user`,
          onClick: (e: React.MouseEvent<HTMLElement>) =>
            handleNavigation(e, 'users'),
        },
        {
          label: 'CUSTOM REPORTS',
          route: `${path}customReports`,
          onClick: (e: React.MouseEvent<HTMLElement>) =>
            handleNavigation(e, 'customReports'),
        },
      ]
    : [
        {
          label: 'DASHBOARD',
          route: path,
          onClick: (e: React.MouseEvent<HTMLElement>) =>
            handleNavigation(e, 'dashboard'),
        },
        {
          label: 'USERS',
          route: `${path}user`,
          onClick: (e: React.MouseEvent<HTMLElement>) =>
            handleNavigation(e, 'users'),
        },
      ];

  const HeaderPlatform = useMemo(
    () => (
      <>
        {' '}
        {snackbar && (
          <Snackbar type={snackbarType} content={snackBarMsg} duration={5000} />
        )}
        <UnsavedData
          open={dialogBoxOpen}
          location={redirectUrl}
          handleLeave={handleDialogBox}
        />
        <IdlePopUp
          open={activityModal}
          logOut={signOut}
          onActive={onActive}
          minutes={5}
          seconds={0}
          timer={{ minutes: 5, seconds: 0 }}
        />
        <Header
          title={'PLATFORM'}
          logo={{ img: nexia_logo_img, path: path }}
          betaIcon={true}
          reportIssue={false}
          navLinkMenuList={navList}
          userMenu={{
            userName: names ? names[0] : '',
            userInitials: initials!,
          }}
          userMenuList={[
            {
              icon: sign_out_img,
              label: 'Logout',
              onClick: signOut,
            },
          ]}
        />
      </>
    ),
    [snackbar, snackbarType, snackBarMsg, path, names, initials, signOut]
  );
  return (
    <>
      {platformPermissions ? (
        <Backdrop open={backDrop} contextValue={handleDisableBackDrop}>
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
          {showCustomReports && (
            <Route path={`${path}customReports`}>
              {ComponentLayout(CustomReports)}
            </Route>
          )}
        </Backdrop>
      ) : (
        <Route path={path}>
          <NotAuthorized signOut={signOut} />
        </Route>
      )}
    </>
  );
};
