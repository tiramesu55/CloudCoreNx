/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from './OKTA';
import { OktaAuth, UserClaims } from '@okta/okta-auth-js';
import { useAppInsightHook } from '@cloudcore/common-lib';
import { OktaClaims } from './use-claims-and-signout/use-claims-and-signout';

interface oidc {
  issuer: string | undefined;
  clientId: string | undefined;
  redirectUri: string | undefined;
}
export interface OktaAndConfigProps {
  oidc: oidc;
  router: React.FC<any>;
}

export function OktaCode(props: OktaAndConfigProps) {
  const [oktaAuthClient] = useState<OktaAuth>(
    new OktaAuth({
      issuer: props.oidc.issuer,
      clientId: props.oidc.clientId,
      redirectUri: props.oidc.redirectUri,
      scopes: ['openid', 'email', 'profile', 'offline_access'],
      tokenManager: {
        storage: 'sessionStorage'
      }
    })
  );
  const { HandleUserLogIn } = useAppInsightHook();
  // const restoreOriginalUri = async (
  //   _oktaAuth: unknown,
  //   originalUri: string | undefined
  // ) => {
  //   history.replace(
  //     toRelativeUrl(originalUri ? originalUri : '', window.location.origin)
  //   );
  // };

  const triggerLogin = async () => {
    await oktaAuthClient.signInWithRedirect({ maxAge: 1 });
  };

  const customAuthHandler = async () => {
    const previousAuthState =
      oktaAuthClient.authStateManager.getPreviousAuthState();
    if (!previousAuthState || !previousAuthState.isAuthenticated) {
      // App initialization stage
      await triggerLogin();
    } else {
      console.log('add timeout');
      // Ask the user to trigger the login process during token autoRenew process
      //setAuthRequiredModalOpen(true);
    }
  };
  const RouterComponent = () => {
    useEffect(() => {
      const authState = oktaAuthClient.authStateManager.getAuthState();
      const names =
        (authState?.accessToken?.claims as UserClaims<OktaClaims>).initials ??
        [];
      const email = authState?.accessToken?.claims.sub;
      HandleUserLogIn({
        properties: {
          userName: names ? names[0] + ' ' + names[1] : '',
          emailId: email,
        },
      });
    }, []);

    return (
      <Switch>
        <props.router />
      </Switch>
    );
  };

  return (
    <div>
      {oktaAuthClient ? (
        <Security oktaAuth={oktaAuthClient}>
          <Switch>
            {/* loginCallbach also accepts omAuthResume and loadingElement properties */}
            <Route path="/login/callback" component={LoginCallback} />
            <SecureRoute
              onAuthRequired={customAuthHandler}
              path="/"
              component={RouterComponent}
            />
          </Switch>
        </Security>
      ) : null}
    </div>
  );
}
