import { useEffect, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";



import styles from './okta-and-config.module.css';

/* eslint-disable-next-line */
export interface OktaAndConfigProps {
 issuer:string;
 clientId: string;
 redirectUri: string;
 scopes: string[]

}

export function OktaAndConfig(props: OktaAndConfigProps) {
  const history = useHistory();
  const [oktaAuthClient, ] = useState<OktaAuth >(
    new OktaAuth({
        transformAuthState: async (oktaAuth, authState) => {
          if (!authState.isAuthenticated) {
            return authState;
          }
          // extra requirement: user must have valid Okta SSO session
          const user = await oktaAuth.token.getUserInfo();
          authState.isAuthenticated = !!user; // convert to boolean
          authState["user"] = user; // also store user object on authState
          return authState;
        },
        issuer: props.issuer,
        clientId: props.clientId,
        redirectUri: props.redirectUri,
        scopes: ["openid", "email", "profile", "offline_access"],
      })
  );

  const restoreOriginalUri = async (_oktaAuth: unknown, originalUri: string | undefined) => {
    history.replace(
      toRelativeUrl(originalUri ? originalUri : "", window.location.origin)
    );
  };

  const customAuthHandler = () => {
    oktaAuthClient?.signInWithRedirect({});
  };
  return (
    <Security
    oktaAuth={oktaAuthClient}
    restoreOriginalUri={restoreOriginalUri}
  >
    <SecureRoute
      onAuthRequired={customAuthHandler}
      path="/"
      component={}
    />

    <Route path="/login/callback" component={LoginCallback} />
  </Security>
  );
}

export default OktaAndConfig;
