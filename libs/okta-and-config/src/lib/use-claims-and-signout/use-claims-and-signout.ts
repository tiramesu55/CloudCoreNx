import { useCallback } from 'react';
import { useOktaAuth } from "@okta/okta-react";
import { UserClaims } from "@okta/okta-auth-js";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseClaimsAndSignout {
  signOut: () => void;
  getClaims: () => UserClaims|undefined;
}

export function useClaimsAndSignout(logoutSSO: string, postRedirectUrl: string ): UseClaimsAndSignout {
  const {authState, oktaAuth } = useOktaAuth();
  const getClaims =  useCallback(() =>{
      return authState?.accessToken?.claims;
  },[authState?.accessToken?.claims]
  )

  const signOut = async () => {
    //get token
    const accessToken = oktaAuth.getAccessToken() ?? "";
    //create a request for
    const request = new Request( logoutSSO , {
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });
    try {
      const response = await fetch(request);
      if (!response.ok) {
        console.log(`HTTP error in closing Session: ${response.status}`);
      }
      console.log("session closed");
    } catch (ex) {
      console.log(ex);
    } finally {
      oktaAuth.signOut({
        postLogoutRedirectUri: postRedirectUrl,
        clearTokensBeforeRedirect: true,
      });
    }
  }

  //const increment = useCallback(() => setCount((x) => x + 1), []);
  return { signOut, getClaims };
}

export default useClaimsAndSignout;
