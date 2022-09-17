// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
//import NxWelcome from './nx-welcome';

import { Route, BrowserRouter as Routes, Link } from 'react-router-dom';
//import { Powerbi } from '@cloudcore/powerbi';
import { OktaAndConfig } from '@cloudcore/okta-and-config';
import { AnalyticsPowerbi } from '@cloudcore/analytics/powerbi';

export function App() {
  return (
    <>
     <OktaAndConfig oidc={{    "issuer": "https://iarx-services.oktapreview.com/oauth2/default/",
    "clientId": "0oa2e7f4dvYLDDdmw1d7", "redirectUri": "http://localhost:3000/login/callback"}} router={AnalyticsPowerbi} />
      {/* <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route path="/powerbi" element={<AnalyticsPowerbi />} />
        <Route path="/powerbi" element={<Powerbi />} />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes> */}
      {/* END: routes */}
    </>
  );
}

export default App;
