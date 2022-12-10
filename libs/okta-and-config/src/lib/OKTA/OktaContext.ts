
import * as React from 'react';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';

export type OnAuthRequiredFunction = (oktaAuth: OktaAuth) => Promise<void>;
export type OnAuthResumeFunction = () => void;

export type RestoreOriginalUriFunction = (oktaAuth: OktaAuth, originalUri: string) => Promise<void>;

export interface IOktaContext {
    oktaAuth: OktaAuth;
    authState: AuthState | null;
}

const OktaContext = React.createContext<IOktaContext | null>(null);

export const useOktaAuth = (): IOktaContext => React.useContext(OktaContext) as IOktaContext;

export default OktaContext;
