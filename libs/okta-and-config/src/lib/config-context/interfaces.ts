interface oidcConfig {
  issuer: string;
  clientId: string;
  redirectUri: string;
  idp: string;
  pkce: boolean;
}

interface mpReports {
  dashboard: string;
  ownerresults?: string;
  partnerResults?: string;
}
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
  isMainApp: boolean;
  marketplaceReports: string[];
}
