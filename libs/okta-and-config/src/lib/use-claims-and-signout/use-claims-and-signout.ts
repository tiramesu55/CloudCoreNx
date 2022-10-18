/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useOktaAuth } from "@okta/okta-react";
import { CustomUserClaims, UserClaims } from "@okta/okta-auth-js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type Applications = 'erv' | 'marketplace' | 'analytics' | 'admin';

export type Dictionary = {
  [index in Applications]: string[];
};
export interface UseClaimsAndSignout {
  signOut: () => void;
  //getClaims: () => UserClaims|undefined;   // to be removed
  //getToken :() => string | undefined;     // to be removed
  token?: string;
  permissions: Dictionary; 
  initials?: string;
  email? : string;
  names?: string[];
}
interface OktaClaims extends CustomUserClaims{
   erv: string[];
   admin: string[];
   marketplace: string[];
   analytics: string[];
   initials: string[];
}


export function useClaimsAndSignout(logoutSSO: string, postRedirectUrl: string ): UseClaimsAndSignout {
  const {authState, oktaAuth } = useOktaAuth();

  //to be removed
  // const getClaims =  useCallback(() =>{
  //     return authState?.accessToken?.claims;
  //  },[authState?.accessToken?.claims]
  // )
  //permissions object
  const permissions: Dictionary = {
    erv: [],
    marketplace: [],
    analytics: [],
    admin: []
  };
  permissions.erv =  (authState?.accessToken?.claims as UserClaims<OktaClaims>).erv;
  permissions.marketplace = (authState?.accessToken?.claims as UserClaims<OktaClaims>).marketplace;
  permissions.analytics = (authState?.accessToken?.claims as UserClaims<OktaClaims>).analytics;
  permissions.admin = (authState?.accessToken?.claims as UserClaims<OktaClaims>).admin;

  const names = (authState?.accessToken?.claims as UserClaims<OktaClaims>).initials ? (authState?.accessToken?.claims as UserClaims<OktaClaims>).initials : [];
  const initials = (names && names.length>0) ? (names[0][0] + names[1][0]) : "";
  const email = authState?.accessToken?.claims.sub;
  const token = authState?.accessToken?.accessToken;

  //getToken to be removed
//   const getToken =  useCallback(() =>{
//     return authState?.accessToken?.accessToken;
//   },[authState?.accessToken]
// )
  const signOut = async () => {
    //get token
    const accessToken = oktaAuth.getAccessToken() ?? "";   //so that token type is a string
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

 
  return { signOut,  token,  permissions, initials, email,  names };
}
export const useOktaAuthLib = () => useOktaAuth();


