import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigContext } from '@cloudcore/okta-and-config';
import App from './app/app';
import { mainStore } from '@cloudcore/redux-store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigContext isMainApp={true}>
    <Provider store={mainStore.store}>

        <BrowserRouter>
          <App />
        </BrowserRouter>

    </Provider>
  </ConfigContext>
);
