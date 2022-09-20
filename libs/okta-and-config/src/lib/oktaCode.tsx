/* eslint-disable react-hooks/exhaustive-deps */
import {  useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { getConfig, AppDispatch } from '@cloudcore/redux-store';
import { useDispatch } from 'react-redux'
interface oidc{ 
    issuer:string;
    clientId: string;
    redirectUri: string;
}
export interface OktaAndConfigProps {
  oidc: oidc;
  router:  React.FC<any>;
}

export function OktaCode(props: OktaAndConfigProps) {
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getConfig());
  }, [])

  const [oktaAuthClient, ] = useState<OktaAuth >(
    new OktaAuth({
        // transformAuthState: async (oktaAuth, authState) => {
        //   if (!authState.isAuthenticated) {
        //     return authState;
        //   }
        //   // extra requirement: user must have valid Okta SSO session
        //   const user = await oktaAuth.token.getUserInfo();
        //   authState.isAuthenticated = !!user; // convert to boolean
        //   authState["user"] = user; // also store user object on authState
        //   return authState;
        // },
        issuer: props.oidc.issuer,
        clientId: props.oidc.clientId,
        redirectUri: props.oidc.redirectUri,
        scopes: ["openid", "email", "profile", "offline_access"],
      })
  );

  const restoreOriginalUri = async (_oktaAuth: unknown, originalUri: string | undefined) => {
    history.replace(
      toRelativeUrl(originalUri ? originalUri : "", window.location.origin)
    );
  };

  const triggerLogin = async () => {
    await oktaAuthClient.signInWithRedirect();
  };

  const customAuthHandler = async () => {
    const previousAuthState = oktaAuthClient.authStateManager.getPreviousAuthState();
    if (!previousAuthState || !previousAuthState.isAuthenticated) {
      // App initialization stage
      await triggerLogin();
    } else {
      console.log("add timeout")
      // Ask the user to trigger the login process during token autoRenew process
      //setAuthRequiredModalOpen(true);
    }
  };
  return (
    <Security
    oktaAuth={oktaAuthClient}
    restoreOriginalUri={restoreOriginalUri}
  >
     <Route path="/login/callback" component={LoginCallback} />
     <SecureRoute
      onAuthRequired={customAuthHandler}
 
      path="/"
      component={props.router}
    />

   
  </Security>
  );
}