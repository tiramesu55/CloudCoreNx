import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { platformStore } from '@cloudcore/redux-store';
import App from './app/app';
import { ConfigContext } from '@cloudcore/okta-and-config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigContext>
    <Provider store={platformStore.store}>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </Provider>
  </ConfigContext>
);
