// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import {  BrowserRouter as Routes, } from 'react-router-dom';

import { OktaCode,  } from '@cloudcore/okta-and-config';

import { Routes as PlatformRoutes } from '@cloudcore/platform/platformlib'

function App() {
  
      return (  
        <Routes>
          <OktaCode oidc={{    "issuer": "https://iarx-services.oktapreview.com/oauth2/default/",
          "clientId": "0oa2e7f4dvYLDDdmw1d7", "redirectUri": "http://localhost:3000/login/callback"}} router={PlatformRoutes} />
        </Routes>
    
      );
    }

export default App;
