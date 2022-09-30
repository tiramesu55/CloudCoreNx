/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-no-useless-fragment */
import { useOktaAuth } from '@okta/okta-react';
import { useState, useEffect, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotAuthorized } from '../components/NotAuthorized';
import { UserForm } from '../features/users/userForm';
import { AddUserForm as UserEmail } from '../features/users/userEmail';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { Dashboard } from '../Dashboard/dashboard';
import { OrganizationForm as AddNewOrganisation } from '../features/organizations/OrganisationForm';
import { MiniDrawer, NavBar, Snackbar } from '../components';
import { ListUsers } from '../features/users/allUsers';
import { getOrganizationsAsync } from '@cloudcore/redux-store';
import { SiteForm } from '../features/sites/siteForm';
import { Sites } from '../features/sites/sites';
import { Header } from '@cloudcore/ui-shared';
import logo from '../images/Nexia-Logo2.png';
import logOutIcon from '../images/sign-out.svg';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout
} from '@cloudcore/okta-and-config';

export const Routes = () => {
  const { oktaAuth, authState } = useOktaAuth();
  // const oktaCfg = useAppSelector(selectOidc);
  // const config = useAppSelector(isConfigSet);
  const dispatch = useAppDispatch();
  const [authorizedState, setAuthorizedState] = useState<boolean | undefined>();
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [formModified, setFormModified] = useState(false);
  const error = useAppSelector((state) => state.user.error);
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');

  const handleFormModified = (value: boolean) => {
    setFormModified(value);
  };
  const config: IConfig = useContext(ConfigCtx)!;
  const { signOut, initials, names } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );

  useEffect(() => {
    if (!authState?.isAuthenticated) {
      oktaAuth.signInWithRedirect();
    } else {
      if( names ){
        setUserName(names.join(' '));
      }
      if( initials ){
          setUserInitials(
          initials
        );
      }
    }
  }, []);

  useEffect(() => {
    if (error) {
      setSnackbar(true);
      setSnackBarType('fetchError');
      setSnackBarMsg('editUserFailure');
    }
  }, [error]);

  useEffect(() => {
    if (platformBaseUrl) {
      dispatch(
        getOrganizationsAsync({
          url: platformBaseUrl,
          token: authState?.accessToken?.accessToken,
        })
      );
    }
  }, [dispatch, platformBaseUrl, authState]);

  useEffect(() => {
    async function authenticate() {
      if (!authState) return;

      if (!authState.isAuthenticated || !authState.accessToken) {
        oktaAuth.signInWithRedirect({});
      } else {
        const claims = authState.accessToken?.claims as any;
        const adminPermissions = claims?.admin;
        if (
          !adminPermissions ||
          (!adminPermissions.includes('global') &&
            !adminPermissions.includes('organization'))
        ) {
          setAuthorizedState(false);
        } else {
          setAuthorizedState(true);
        }
      }
    }

    authenticate();
  }, [authState, oktaAuth, dispatch]);

  return (
    <>
      {authorizedState ? (
        <>
          {' '}
          {snackbar && (
            <Snackbar
              type={snackbarType}
              content={snackBarMsg}
              duration={5000}
            />
          )}
          {/* <NavBar /> */}
          <Header
            title={'PLATFORM MANAGEMENT'}
            logo={{ img: logo, path: '/' }}
            betaIcon={true}
            reportIssue={false}
            navLinkMenuList={[
              { label: 'DASHBOARD', route: '/' },
              { label: 'USERS', route: '/user' },
            ]}
            userMenu={{
              userName: userName,
              userInitials: userInitials,
            }}
            userMenuList={[
              {
                icon: logOutIcon,
                label: 'Logout',
                onClick: signOut,
              },
            ]}
          />
              <>
                <Route exact path="/" component={Dashboard} />
                <Route
                  path="/organization/addOrganization"
                  component={AddNewOrganisation}
                />
                <Route
                  path="/organization/editOrganization"
                  component={AddNewOrganisation}
                />
                <Route exact path="/user" component={ListUsers} />
                <Route path="/user/email" component={UserEmail} />
                <Route path="/user/addUser" component={UserForm} />
                <Route path="/user/editUser" component={UserForm} />
                <Route path="/organization/sites" component={Sites} />
                <Route path="/organization/editSite" component={SiteForm} />

                <Route path="/organization/addSite" component={SiteForm} />
                <Route
                  path="/organization/editOrg/addSite"
                  component={SiteForm}
                />
              </>
        </>
      ) : authorizedState === undefined ? (
        <></>
      ) : (
        <NotAuthorized />
      )}
    </>
  );
};
