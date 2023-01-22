/* eslint-disable react-hooks/exhaustive-deps */
import { useOktaAuth } from '../OKTA';
import { CustomUserClaims, UserClaims } from '@okta/okta-auth-js';
import { ConfigCtx } from '../config-context/context';
import { useContext } from 'react';
import { useAppInsightHook } from '@cloudcore/common-lib';
import { useAppSelector } from 'libs/redux-store/src/lib/store-platform';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type Applications = 'erv' | 'marketplace' | 'analytics' | 'admin';

export type Dictionary = {
  [index in Applications]: string[];
};
export interface UseClaimsAndSignout {
  signOut: () => void;
  token?: string;
  permissions: Map<Applications, string[]>;
  initials?: string;
  email?: string;
  names?: string[];
}
export interface OktaClaims extends CustomUserClaims {
  erv: string[];
  admin: string[];
  marketplace: string[];
  analytics: string[];
  initials: string[];
}

//we assume that the config  context is the most outward one
export function useClaimsAndSignout(): UseClaimsAndSignout | null {
  const { oktaAuth, authState } = useOktaAuth();
  const { HandleUserLogOut } = useAppInsightHook();
  const ctx = useContext(ConfigCtx);
  const postLogoutRedirectUri = useAppSelector(
    (state) => state.organizations.postLogoutRedirectUrl
  );
  if (!ctx) return null;
  const { logoutSSO } = ctx;

  const permissions = new Map<Applications, string[]>([
    ['erv', (authState?.accessToken?.claims as UserClaims<OktaClaims>).erv],
    [
      'marketplace',
      (authState?.accessToken?.claims as UserClaims<OktaClaims>).marketplace,
    ],
    [
      'analytics',
      (authState?.accessToken?.claims as UserClaims<OktaClaims>).analytics,
    ],
    ['admin', (authState?.accessToken?.claims as UserClaims<OktaClaims>).admin],
  ]);

  const names =
    (authState?.accessToken?.claims as UserClaims<OktaClaims>).initials ?? [];
  const initials = names && names.length > 0 ? names[0][0] + names[1][0] : '';
  const email = authState?.accessToken?.claims.sub;
  const token = authState?.accessToken?.accessToken;

  const signOut = async () => {
    //get token
    const accessToken = oktaAuth.getAccessToken() ?? ''; //so that token type is a string
    //create a request for
    const request = new Request(logoutSSO, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    });
    try {
      const response = await fetch(request);
      if (!response.ok) {
        console.log(`HTTP error in closing Session: ${response.status}`);
      }
      console.log('session closed');
    } catch (ex) {
      console.log(ex);
    } finally {
      oktaAuth.signOut({
        postLogoutRedirectUri: postLogoutRedirectUri,
        clearTokensBeforeRedirect: true,
      });
      HandleUserLogOut({
        properties: {
          userName: names ? names[0] + ' ' + names[1] : '',
          emailId: email,
        },
      });
    }
  };
  return { signOut, token, permissions, initials, email, names };
}
