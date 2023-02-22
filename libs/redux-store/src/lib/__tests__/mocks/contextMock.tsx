import { jest } from "@jest/globals";
import { createContext } from 'react';

type Applications = 'erv' | 'marketplace' | 'analytics' | 'admin';

export interface UseClaimsAndSignout {
  signOut: () => void;
  token?: string;
  permissions: Map<Applications, string[]>; 
  initials?: string;
  email? : string;
  names?: string[];
}

interface oidcConfig {
    issuer: string;
    clientId: string;
    redirectUri: string;
    idp?: string;
    pkce: boolean;
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
    DEFAULT_REPORTID?: string;
    isMainApp: boolean;
    marketplaceReports: string[]; //reports for marketplace.  Simple assumptions that we know which ID to use where
  }


const signOut = () => jest.fn();
const token = "token";
const permissions = {
  get: () => ["permissions"]
};
const initials = ""; 
const email = "";  
const names = ""; 

const config = {
    "homeBaseUrl": "https://iarx-services.oktapreview.com",
    "powerbiBaseUrl": "https://powerbi.dev.nexia.app",
    "platformBaseUrl": "https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api",
    "marketBaseUrl": "https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/marketplace",
    "logoutSSO": "https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/SSOLogout",
    "postLogoutRedirectUri": "https://ssotest.walgreens.com/idp/idpLogout",
    "oidcConfig": {
      "issuer": "https://iarx-services.oktapreview.com/oauth2/default/",
      "clientId": "0oa2e7f4dvYLDDdmw1d7",
      "redirectUri": "http://localhost:3000/login/callback",
      "pkce": true
    },
    "instrumentationKey": "8f2e56e0-9ec2-491d-80bb-42f37ada0f5f",
    "REACT_APP_SUITES_URL": "https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/GetSuitesByPermission",
    "REACT_APP_POWERBI_URL": "https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/Reports/Report",
    "marketplaceReports":["26f42171-0528-4e24-8592-fad82f6327f2","e618da69-bf63-49c4-a375-d9a78e466acc","1d37f257-9dd3-4417-9389-3638e76834c9"  ],
    "DEFAULT_REPORTID": "26f42171-0528-4e24-8592-fad82f6327f2"
  }
const ConfigCtx = createContext<IConfig | null>(null);
const ConfigContext = ({ children, isMainApp }: any) => {
    return <ConfigCtx.Provider value={{...config, isMainApp}}> {children}</ConfigCtx.Provider>;
};
export const useClaimsAndSignout = () => ({
    signOut,  
    token,  
    permissions, 
    initials, 
    email,  
    names 
})
export {
    ConfigCtx,
    ConfigContext
}; 