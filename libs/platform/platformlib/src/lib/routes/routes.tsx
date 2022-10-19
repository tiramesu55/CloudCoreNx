/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-no-useless-fragment */

//@TODO get rid of OKTA
import { useState, useEffect, useContext, useMemo } from 'react';
import { Route } from 'react-router-dom';
import { UserForm } from '../features/users/userForm';
import { AddUserForm as UserEmail } from '../features/users/userEmail';
import { NotAuthorized } from '@cloudcore/ui-shared';
import { Dashboard } from '../Dashboard/dashboard';
import { OrganizationForm as AddNewOrganisation } from '../features/organizations/OrganisationForm';
import userOnboardingInstructions from '../features/users/userOnboardingInstructions';
import UserOnboarding from '../features/users/userOnboardingForm';
import { Snackbar } from '@cloudcore/ui-shared';
import { ListUsers } from '../features/users/allUsers';
import { getOrganizationsAsync, platformStore } from '@cloudcore/redux-store';
import { SiteForm } from '../features/sites/siteForm';
import { Sites } from '../features/sites/sites';
import { Header } from '@cloudcore/ui-shared';
import logo from '../images/Nexia-Logo2.png';
import logOutIcon from '../images/sign-out.svg';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

const { useAppDispatch, useAppSelector } = platformStore;

export const Routes = () => {
  const config: IConfig = useContext(ConfigCtx)!;
  const { signOut, token, initials, names, permissions } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );

  const adminPermission = permissions?.admin && permissions?.admin.length > 0;

  const dispatch = useAppDispatch();
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [formModified, setFormModified] = useState(false);
  // TODO unable use useAppSelector when we switch to main
  /*   const { error } = useAppSelector((state) => state.user); */

  const handleFormModified = (value: boolean) => {
    setFormModified(value);
  };

  /*   useEffect(() => {
    if (error) {
      setSnackbar(true);
      setSnackBarType('fetchError');
      setSnackBarMsg('errorMsg');
    }
  }, [error]); */
  console.log(platformBaseUrl, 'plat');
  useEffect(() => {
    if (platformBaseUrl) {
      dispatch(
        getOrganizationsAsync({
          url: platformBaseUrl,
          token: token,
        })
      );
      console.log(platformBaseUrl, 'base');
    }
  }, [dispatch, platformBaseUrl, token]);

  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform' : '/'}`;
  }, [config.isMainApp]);
  const platformPermissions = permissions.admin?.length > 0;

  const ComponentLayout = (Component: any) => {
    return (
      <>
        {HeaderPlatform}
        <Component />
      </>
    );
  };

  const HeaderPlatform = useMemo(
    () => (
      <>
        {' '}
        {snackbar && (
          <Snackbar type={snackbarType} content={snackBarMsg} duration={5000} />
        )}
        <Header
          title={'PLATFORM'}
          logo={{ img: logo, path: '/' }}
          betaIcon={true}
          reportIssue={false}
          navLinkMenuList={[
            { label: 'DASHBOARD', route: '/' },
            { label: 'USERS', route: '/user' },
          ]}
          userMenu={{
            userName: names ? names[0] : '',
            userInitials: initials!,
          }}
          userMenuList={[
            {
              icon: logOutIcon,
              label: 'Logout',
              onClick: signOut,
            },
          ]}
        />
      </>
    ),
    [snackbar, snackbarType, snackBarMsg, names, initials, signOut]
  );

  return (
    <>
      {platformPermissions ? (
        <>
          <Route exact path={`${path}`}>
            {ComponentLayout(Dashboard)}
          </Route>
          <Route path={`${path}organization/addOrganization`}>
            {ComponentLayout(AddNewOrganisation)}
          </Route>
          <Route path={`${path}organization/editOrganization`}>
            {ComponentLayout(AddNewOrganisation)}
          </Route>
          <Route exact path={`${path}user`}>
            {ComponentLayout(ListUsers)}
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
          <Route path={`${path}user/onboardingInstructions`}>
            {ComponentLayout(userOnboardingInstructions)}
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
        </>
      ) : (
        <NotAuthorized signOut={signOut} />
      )}
    </>
  );
};
