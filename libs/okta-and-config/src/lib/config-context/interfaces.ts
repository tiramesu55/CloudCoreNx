interface oidcConfig {
    issuer: string,
    clientId: string,
    redirectUri: string,
    idp: string,
    pkce: boolean,
}

export interface IConfig {
    oidcConfig?: oidcConfig,
    instrumentationKey: string,
    logoutSSO: string,
    postLogoutRedirectUri: string,
    platformBaseUrl: string,
    powerbiBaseUrl?: string,
    marketBaseUrl?: string,
    REACT_APP_SUITES_URL?: string,
    REACT_APP_POWERBI_URL?: string
}

export interface IdleConfigReducerState {
    config: IConfig | null;
    error: {
      error: string;
      status: number;
    };
    alertState: boolean;
}

