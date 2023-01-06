import { Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { analyticsStore } from '@cloudcore/redux-store';
import App from './app/app';
import { BrowserRouter } from 'react-router-dom';
import { ConfigContext } from '@cloudcore/okta-and-config';
import { theme } from '@cloudcore/ui-shared';
import { ThemeProvider } from '@mui/material';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ConfigContext>
    <Provider store={analyticsStore.store}>
      <Suspense fallback={<span>Loading ....</span>}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </Suspense>
    </Provider>
  </ConfigContext>
);
