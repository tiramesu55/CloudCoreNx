
/* eslint-disable react/jsx-no-useless-fragment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useContext } from 'react';

import { OktaCode } from '@cloudcore/okta-and-config';

import { Routes as PlatformRoutes } from '@cloudcore/platform/platformlib';
import { ConfigCtx, IConfig } from '@cloudcore/context';

function App() {
  const config: IConfig | null = useContext(ConfigCtx);
  return (
    <>
      {config && 

          <OktaCode
            oidc={{
              issuer: config.oidcConfig?.issuer,
              clientId: config.oidcConfig?.clientId,
              redirectUri: config.oidcConfig?.redirectUri,
            }}
            router={PlatformRoutes}
          />
          }
     </>
  );
}

export default App;
