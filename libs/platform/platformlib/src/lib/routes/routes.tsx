/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-no-useless-fragment */

//@TODO get rid of OKTA
import { useState, useEffect, useContext } from 'react';
import { Route } from 'react-router-dom';
import { UserForm } from '../features/users/userForm';
import { AddUserForm as UserEmail } from '../features/users/userEmail';
import { NotAuthorized } from '@cloudcore/ui-shared';
import { Dashboard } from '../Dashboard/dashboard';
import { OrganizationForm as AddNewOrganisation } from '../features/organizations/OrganisationForm';
import userOnboardingInstructions from '../features/users/userOnboardingInstructions';
import UserOnboarding from '../features/users/userOnboardingForm';
import { Snackbar } from '../components';
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
  const error = useAppSelector((state) => state.user.error);

  const handleFormModified = (value: boolean) => {
    setFormModified(value);
  };

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
          token: token,
        })
      );
    }
  }, [dispatch, platformBaseUrl, token]);

  return (
    <>
      {adminPermission ? (
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
            <Route path="/user/onboarding" component={UserOnboarding} />
            <Route path="/user/onboardingInstructions" component={userOnboardingInstructions}/>
            <Route path="/organization/sites" component={Sites} />
            <Route path="/organization/editSite" component={SiteForm} />
            <Route path="/organization/addSite" component={SiteForm} />
            <Route path="/organization/editOrg/addSite" component={SiteForm} />
          </>
        </>
      ) : (
        <NotAuthorized signOut={signOut} />
      )}
    </>
  );
};
