
/* eslint-disable react/jsx-no-useless-fragment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useContext } from 'react';

import { ConfigCtx, IConfig, OktaCode } from '@cloudcore/okta-and-config';


import { MpRoutes } from '@cloudcore/marketplace/marketplace-lib';

function App() {
  const config: IConfig | null = useContext(ConfigCtx);

  return (
    <>
      {config  &&

          <OktaCode
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            oidc={config.oidcConfig!}
            router={MpRoutes}
          />
      }
    </>
  );
}

export default App;
