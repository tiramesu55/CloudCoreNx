import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { platformStore } from '@cloudcore/redux-store';
import theme from 'libs/ui-shared/src/themes';
import { ThemeProvider } from '@mui/material';
import App from './app/app';
import { ConfigContext } from '@cloudcore/okta-and-config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigContext>
    <Provider store={platformStore.store}>
      <StrictMode>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </StrictMode>
    </Provider>
  </ConfigContext>
);
