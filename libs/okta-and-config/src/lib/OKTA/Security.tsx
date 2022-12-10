

import * as React from 'react';
import {  AuthState, OktaAuth } from '@okta/okta-auth-js';  //these are only definions
import OktaContext from './OktaContext';

//import { compare as compareVersions } from 'compare-versions';


const Security: React.FC<{
  oktaAuth: OktaAuth,
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>> = ({   //todo @get rid of intersection if possible
  oktaAuth,
  children
}) => { 

  //local authState
  const [authState, setAuthState] = React.useState(() => {
    if (!oktaAuth) {
      return null;
    }
    return oktaAuth.authStateManager.getAuthState();
  });

  //below we exit if oktaAuth is not snt to this component
  React.useEffect(() => {
    if (!oktaAuth ) {
      return;
    }


  }, [oktaAuth,]); // empty array, only check on component mount

  //kep state authState current
  React.useEffect(() => {
    if (!oktaAuth) {
      return;
    }

    // Update Security provider with latest authState
    const currentAuthState = oktaAuth.authStateManager.getAuthState();
    if (currentAuthState !== authState) {
      setAuthState(currentAuthState);
    }
    const handler = (authState: AuthState) => {
      setAuthState(authState);
    };
    oktaAuth.authStateManager.subscribe(handler);

    // Trigger an initial change event to make sure authState is latest
    oktaAuth.start();

    return () => {
      oktaAuth.authStateManager.unsubscribe(handler);
    };
  }, [authState, oktaAuth]);


  if (!oktaAuth._oktaUserAgent) {
    console.warn('_oktaUserAgent is not available on auth SDK instance. Please use okta-auth-js@^5.3.1 .');
  }


  return (
    <OktaContext.Provider value={{ 
      oktaAuth, 
      authState, 

    }}>
      {children}
    </OktaContext.Provider>
  );
};

export default Security;
