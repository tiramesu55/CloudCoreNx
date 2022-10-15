// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { useContext } from 'react';
import { ConfigCtx, IConfig, OktaCode } from '@cloudcore/okta-and-config';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@cloudcore/ui-shared';
import { Home } from '@cloudcore/home';

function App() {
  const config: IConfig | null = useContext(ConfigCtx);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {config && (
        <ThemeProvider theme={theme}>
          <OktaCode
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            oidc={config.oidcConfig!}
            router={Home}
          />
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
