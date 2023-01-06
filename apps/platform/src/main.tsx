
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { platformStore } from '@cloudcore/redux-store';
import { theme } from '@cloudcore/ui-shared';
import { ThemeProvider } from '@mui/material/styles';
import App from './app/app';
import { ConfigContext } from '@cloudcore/okta-and-config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigContext>
    <Provider store={platformStore.store}>     
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
