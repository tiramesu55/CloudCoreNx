interface oidcConfig {
  issuer: string;
  clientId: string;
  redirectUri: string;
  idp: string;
  pkce: boolean;
}

// interface mpReports {
//   dashboard: string;
//   ownerresults?: string;
//   partnerResults?: string;
// }
export interface IConfig {
  oidcConfig?: oidcConfig;
  instrumentationKey: string;
  logoutSSO: string;
  postLogoutRedirectUri: string;
  homeBaseUrl?: string;
  platformBaseUrl: string;
  powerbiBaseUrl?: string;
  marketBaseUrl?: string;
  REACT_APP_SUITES_URL?: string;
  REACT_APP_POWERBI_URL?: string;
  DEFAULT_REPORTID?: string;
  isMainApp: boolean;
  marketplaceReports: string[]; //reports for marketplace.  Simple assumptions that we know which ID to use where
  functionAppBaseUrl:string;
}
