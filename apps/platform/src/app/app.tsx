/* eslint-disable react/jsx-no-useless-fragment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useContext } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { ConfigCtx, IConfig, OktaCode } from '@cloudcore/okta-and-config';

import { Routes as PlatformRoutes } from '@cloudcore/platform/platformlib';

function App() {
  const config: IConfig | null = useContext(ConfigCtx);
  return (
    <>
      {config ? (
        <OktaCode
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          oidc={config.oidcConfig!}
          router={PlatformRoutes}
        />
      ) : (
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer - 1,
          }}
          open={true}
          style={{
            position: 'absolute',
            backgroundColor: 'white',
          }}
        >
          <CircularProgress color="info" />
        </Backdrop>
      )}
    </>
  );
}

export default App;
