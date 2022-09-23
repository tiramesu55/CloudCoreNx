
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

import { BrowserRouter } from 'react-router-dom';
import { ConfigContext } from '@cloudcore/okta-and-config';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigContext>
    {/* <Provider store={store}> */}
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
  </ConfigContext>
);
