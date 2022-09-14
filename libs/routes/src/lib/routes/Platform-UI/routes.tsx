import { useOktaAuth } from "@okta/okta-react";
import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { SecureRoute } from "@okta/okta-react";

import {
  selectOidc,
  isConfigSet,
} from "../features/configurations/configurationsSlice";
import NotAuthorized from "../components/NotAuthorized";
import UserForm from "../features/users/userForm";
import UserEmail from "../features/users/userEmail";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Dashboard from "../dashboard";
import AddNewOrganisation from "../features/organizations/OrganisationForm";
import { OktaAuth } from "@okta/okta-auth-js";
import Snackbar from "../components/Snackbar";
import NavBar from "../components/Navbar";
import MiniDrawer from "../components/LeftNavBarNavigation";
import ListUsers from "../features/users/allUsers";
import {
  selectBaseUrl,
  selectToken,
  setToken,
} from "../features/configurations/configurationsSlice";
import { getOrganizationsAsync } from "../features/organizations/organizationsSlice";
import SiteForm from "../features/sites/siteForm";
import Sites from "../features/sites/sites";

const Routes = () => {
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
  let error = useAppSelector((state) => state.user.error);

  const handleFormModified = (value: boolean) => {
    setFormModified(value);
  };

 // const [oktaAuthClient, setOktaAuth] = useState<OktaAuth | null>(null); // use for now local
  // const customAuthHandler = () => {
  //   props.oktaAuthClient?.signInWithRedirect({});
  // };

  // useEffect(() => {
  //   if (config) {
  //     setOktaAuth(new OktaAuth(oktaCfg));
  //   }
  // }, [config, oktaCfg]);

  // useEffect(() => {
  //   if (!authState?.isAuthenticated) {
  //     oktaAuth.signInWithRedirect();
  //   }
  // }, []);

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

export default Routes;
