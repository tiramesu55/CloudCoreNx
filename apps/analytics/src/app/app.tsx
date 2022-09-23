// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
//import NxWelcome from './nx-welcome';

import { Route, BrowserRouter as Routes, Link } from 'react-router-dom';
//import { Powerbi } from '@cloudcore/powerbi';
import { OktaCode, useClaimsAndSignout } from '@cloudcore/okta-and-config';
import { AnalyticsPowerbi } from '@cloudcore/analytics/powerbi';

function App() {
  return (

    <Routes>
     <OktaCode oidc={{    "issuer": "https://iarx-services.oktapreview.com/oauth2/default/",
    "clientId": "0oa2e7f4dvYLDDdmw1d7", "redirectUri": "http://localhost:3000/login/callback"}} router={AnalyticsPowerbi} />
    </Routes>

  );
}

export default App;
