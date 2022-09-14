import { useState, useEffect, createContext } from "react";
import { Route, useHistory } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";

import {
  selectOidc,
  getConfig,
  isConfigSet,

} from "./features/configurations/configurationsSlice";

import { CircularProgress, Backdrop } from "@mui/material";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { withStyles } from "@mui/styles";

import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";

import Routes from "./routes/routes";
import { Report } from '@cloudcore/redux-store';

export const BackDropContext = createContext(null);

function App() {
  const dispatch = useAppDispatch();
  const [disableBackDrop, setDisableBackDrop] = useState(false);
  const [oktaAuthClient, setOktaAuth] = useState<OktaAuth | null>(null); // use for now local
  const oktaCfg = useAppSelector(selectOidc);

  const config = useAppSelector(isConfigSet);
  const history = useHistory();

  const orgLoadingState = useAppSelector(
    (state) => state.organizations.status === "loading"
  );

  const dashboardLoadingState = useAppSelector(
    (state) => state.dashboard.status === "loading"
  );

  const siteLoadingState = useAppSelector(
    (state) => state.sites.status === "loading"
  );

  const userLoadingState = useAppSelector(
    (state) => state.user.status === "loading"
  );

  const applicationLoadingState = useAppSelector(
    (state) => state.applications.status === "loading"
  );

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(
      toRelativeUrl(originalUri ? originalUri : "", window.location.origin)
    );
  };

  const customAuthHandler = () => {
    oktaAuthClient?.signInWithRedirect();
  };

  const handleDisableBackDrop: any = (value: boolean) => {
    setDisableBackDrop(value);
  };
  const backDrop: any =
    disableBackDrop === false
      ? orgLoadingState ||
        userLoadingState ||
        dashboardLoadingState ||
        siteLoadingState ||
        applicationLoadingState
      : false;

  useEffect(() => {
    if(!oktaCfg.clientId) {
    dispatch(getConfig());
    }
  }, []);

  useEffect(() => {
    if (config && !oktaAuthClient ) {
      setOktaAuth(new OktaAuth(
        {
          transformAuthState: async(oktaAuth, authState) => {
            if (!authState.isAuthenticated) {
              return authState;
            }
            // extra requirement: user must have valid Okta SSO session
            const user = await oktaAuth.token.getUserInfo();
            authState.isAuthenticated = !!user; // convert to boolean
            authState.users = user; // also store user object on authState
            return authState;
          },
          restoreOriginalUri: undefined,
          issuer: oktaCfg.issuer,
          clientId:oktaCfg.clientId,
          redirectUri:oktaCfg.redirectUri,
          pkce:oktaCfg.pkce,

          responseMode: 'fragment', 
        }));
    }
  }, [ config]);

  const CustomBackDropCss = withStyles((theme) => ({
    "@global": {
      "html, body": {
        height: "100%",
      },
    },
  }))(() => null);

  return (

      <BackDropContext.Provider value={handleDisableBackDrop}>
        <Backdrop open={backDrop} invisible={false} sx={{ zIndex: "10" }}>
          <CircularProgress
            thickness={4}
            size={60}
            disableShrink
            sx={{ color: "primary", animationDuration: "600ms" }}
            value={100}
          />
        </Backdrop>
        <CustomBackDropCss />
        {oktaAuthClient ? (
          <Security
            oktaAuth={oktaAuthClient}
            restoreOriginalUri={restoreOriginalUri}
          >
            <Route path="/login/callback" component={LoginCallback} />
            <SecureRoute
              onAuthRequired={customAuthHandler}
              path="/"
              render={(props) => <Routes />}
            />
          </Security>
        ) : (
          <div>Loading...</div>
        )}
      </BackDropContext.Provider>

  );
}

export default App;
