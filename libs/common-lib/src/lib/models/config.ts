export interface IConfig {
    REACT_APP_POWERBI_URL: string,
    REACT_APP_SUITES_URL: string,
    issuer: string,
    clientId: string,
    redirectUri: string,
    postLogoutRedirectUri:string|undefined,
    idp: string,
    pkce: boolean,
    instrumentationKey: string,
    logoutSSO: string
}

