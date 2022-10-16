// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { useContext } from 'react';
import { ConfigCtx, IConfig, OktaCode } from '@cloudcore/okta-and-config';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@cloudcore/ui-shared';
// import { Home } from '@cloudcore/home';
import { AnalyticsPowerbi } from '@cloudcore/analytics/powerbi';
import { MpRoutes } from '@cloudcore/marketplace/marketplace-lib';
import { Route, Redirect } from 'react-router-dom';

function App() {
  const config: IConfig | null = useContext(ConfigCtx);
  const MainRoute = () => {
    return (<>
      <Route exact path="/">
        <Redirect to="/analytics" />
      </Route>
      <AnalyticsPowerbi/>
      <MpRoutes/>
    </>)
  }
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {config && (
        <ThemeProvider theme={theme}>
          <OktaCode
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            oidc={config.oidcConfig!}
            router={MainRoute}
          />
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
