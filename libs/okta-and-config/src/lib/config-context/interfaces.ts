interface oidcConfig {
    issuer: string,
    clientId: string,
    redirectUri: string,
    postLogoutRedirectUri:string|undefined,
    idp: string,
    pkce: boolean,
}

export interface IConfig {
    oidcConfig?: oidcConfig,
    instrumentationKey: string,
    logoutSSO: string,
    platformBaseUrl: string,
    powerbiBaseUrl?: string,
    marketBaseUrl?: string
}

export interface IdleConfigReducerState {
    config: IConfig | null;
    error: {
      error: string;
      status: number;
    };
    alertState: boolean;
}

// enum ActionType{
//     //----------------Alert---------------------------------------
//        SET_OPEN = 'SET_OPEN',
//        SET_CLOSE = 'SET_CLOSE',
//     //----------------Config--------------------------------------
//        SET_CONFIG = 'SET_CONFIG'
// }
// interface configAction {
//     type: ActionType.SET_CONFIG;
//     payload: IConfig | null;
// }
  
 // export type ConfigActions = configAction;