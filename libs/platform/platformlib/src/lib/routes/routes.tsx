/* eslint-disable react/jsx-no-useless-fragment */
import { useOktaAuth } from "@okta/okta-react";
import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import {NotAuthorized} from "../components/NotAuthorized";
import {UserForm} from "../features/users/userForm";
import {AddUserForm as UserEmail} from "../features/users/userEmail";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import {Dashboard} from "../Dashboard/dashboard";
import { OrganizationForm as AddNewOrganisation } from "../features/organizations/OrganisationForm";
import {MiniDrawer, NavBar, Snackbar} from "../components";
import {ListUsers} from "../features/users/allUsers";
import {
  selectBaseUrl,
  selectToken,
  setToken,
  getOrganizationsAsync,
} from '@cloudcore/redux-store';
import {SiteForm} from "../features/sites/siteForm";
import {Sites} from "../features/sites/sites";

export const Routes = () => {
  const { oktaAuth, authState } = useOktaAuth();
  // const oktaCfg = useAppSelector(selectOidc);
  // const config = useAppSelector(isConfigSet);
  const dispatch = useAppDispatch();
  const [authorizedState, setAuthorizedState] = useState<boolean|undefined>();
  const url = useAppSelector(selectBaseUrl);
  const token = useAppSelector(selectToken);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState("");
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [formModified, setFormModified] = useState(false);
  const error = useAppSelector((state) => state.user.error);

  const handleFormModified = (value: boolean) => {
    setFormModified(value);
  };

  useEffect(() => {
    if (error) {
      setSnackbar(true);
      setSnackBarType("fetchError");
      setSnackBarMsg("editUserFailure");
    }
  }, [error]);

  useEffect(() => {
    if (token) {
      dispatch(getOrganizationsAsync(url));
    }
  }, [dispatch, token,url]);

  useEffect(() => {
    async function authenticate() {
      if (!authState) return;

      if (!authState.isAuthenticated || !authState.accessToken) {
        oktaAuth.signInWithRedirect({});
      } else {
        dispatch(setToken(authState.accessToken.accessToken));
        const claims = authState.accessToken?.claims as any;
        const adminPermissions = claims?.admin;
        if (
          !adminPermissions ||
          (!adminPermissions.includes("global") &&
            !adminPermissions.includes("organization"))
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
          {" "}
          {snackbar && (
            <Snackbar
              type={snackbarType}
              content={snackBarMsg}
              duration={5000}
            />
          )}
          <NavBar />
          <MiniDrawer />
          <Switch>
              <MiniDrawer>
                <>
                  <Route
                    exact
                    path="/"
                    component={Dashboard}
                  />
                  <Route

                    path="/organization/addOrganization"
                    component={AddNewOrganisation}
                  />
                  <Route

                    path="/organization/editOrganization"
                    component={AddNewOrganisation}
                  />
                  <Route
                   exact
                    path="/user"
                    component={ListUsers}
                  />
                  <Route

                    path="/user/email"
                    component={UserEmail}
                  />
                  <Route

                    path="/user/addUser"
                    component={UserForm}
                  />
                  <Route

                    path="/user/editUser"
                    component={UserForm}
                  />
                  <Route

                    path="/organization/sites"
                    component={Sites}
                  />
                  <Route

                    path="/organization/editSite"
                    component={SiteForm}
                  />

                  <Route

                    path="/organization/addSite"
                    component={SiteForm}
                  />
                  <Route

                    path="/organization/editOrg/addSite"
                    component={SiteForm}
                  />
                </>
              </MiniDrawer>
          </Switch>
        </>
      ) : 
 
      (
         authorizedState === undefined? ( <></>) :(
        <NotAuthorized />) 
        
      )
      }
    </>
  );
};

