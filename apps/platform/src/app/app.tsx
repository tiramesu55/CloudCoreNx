/* eslint-disable react/jsx-no-useless-fragment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useContext } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { BrowserRouter as Routes } from 'react-router-dom';

import { OktaCode } from '@cloudcore/okta-and-config';

import { Routes as PlatformRoutes } from '@cloudcore/platform/platformlib';
import { ConfigCtx, IConfig } from '@cloudcore/context';

function App() {
  const config: IConfig | null = useContext(ConfigCtx);
  console.log(config)
  return (
    <>
      {config ? (
     
          <OktaCode
            oidc={{
              issuer: config.oidcConfig?.issuer,
              clientId: config.oidcConfig?.clientId,
              redirectUri: config.oidcConfig?.redirectUri,
            }}
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
