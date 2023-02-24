/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from '@testing-library/react';
import { startTransition, Suspense } from 'react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';   
import { Provider } from 'react-redux';
import { store } from '../store-main';
import { BrowserRouter } from 'react-router-dom';
import { AnalyticsPowerbi } from '@cloudcore/analytics/powerbi';
import { ConfigContext } from '@cloudcore/okta-and-config';

import { theme } from '@cloudcore/ui-shared';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

jest.mock('axios', () => {
    const { config, userData, MaintenanceDetails, PlatformApplication, GetSuitesByPermission } = require('./mocks/index'); 

    return {
    get: async (url: any) => {
        if (url.indexOf('config') !== -1) {
          return Promise.resolve({data: config});
        } else if (url.indexOf('GetSuitesByPermission') !== -1) {
             return Promise.resolve( {data: GetSuitesByPermission});
        } else if (url.indexOf('Maintenance') !== -1) {
            return Promise.resolve({data: MaintenanceDetails});
        } else if (url.indexOf('PlatformApplication') !== -1) {
            return Promise.resolve({data: PlatformApplication});
        } else if (url.indexOf('PlatformUser') !== -1) {
            return Promise.resolve({data: userData});
        } else {
          throw new Error(`Unexpected URL: ${url}`);
        }
      },
    post: async (url: any) => {
        console.log('url', url)
        return Promise.resolve({
            data: {
                access_token: 'test',
            }
        });
    },
}});
jest.mock('@cloudcore/common-lib', () => {
    const { IUiReportList, IFilterReport, ActionType, useMaintenance,   
        IErrorTypeResponse,
        requests,
        IAlert,
        IAppsMenu } = require('../../../../common-lib/src');

    const HandleReportEvent = jest.fn();
    const HandleUserLogOut = jest.fn();
    const HandleUserLogIn = jest.fn();
    const trackException = jest.fn();

    return {
        useAppInsightHook: () => ({
            HandleReportEvent,
            HandleUserLogOut,
            HandleUserLogIn,
            trackException
        }),
        IUiReportList, 
        IFilterReport, 
        ActionType,
        useMaintenance,
        IErrorTypeResponse,
        requests,
        IAlert,
        IAppsMenu
    }
})
const mGetRandomValues = jest.fn().mockReturnValueOnce(new Uint32Array(10));
    Object.defineProperty(window, 'crypto', {
      value: { getRandomValues: mGetRandomValues },
});
Object.defineProperty(window, 'fetch', {
    value: jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
        text: () => Promise.resolve("test"),
      })
    ),
  });
  class Request {
    constructor() {
        return this;
    }
  }
  Object.defineProperty(window, 'Request', {
    value: Request,
  });

describe('commonSlice', () => {
    it('should render AnalyticsPowerbi component', async () => {
       
         let container;
        await act(async () => {
            startTransition(() => {
                container = render(
                <Suspense fallback={<div>Loading...</div>} >
                <ConfigContext>
                    <Provider store={store}>
                        <ThemeProvider theme={theme}>
                            <BrowserRouter>
                                <AnalyticsPowerbi />
                            </BrowserRouter>
                        </ThemeProvider>
                    </Provider>
                </ConfigContext>
                </Suspense>)
            });
        });

        expect(container).toMatchSnapshot();

    });
    // });

//   it('should handle getUserConfig', async () => {
//     const result = await store.dispatch(getUserConfig({ url: 'url', token: 'token' }));
//     expect(commonSlice.reducer(store.getState().common, result)).toEqual({
//       openAlert: false,
//       type: 'error',
//       status: 'idle',
//       content: '',
//       error: '',
//       userConfig: {
//         discriminator: '',
//         email: '',
//         id: '',
//         lastOpenedReportId: '',
//         userSetDefaultApp: '',
//         defaultApp: null,
//         orgCode: '',
//         inactiveDate: null,
//         startDate: null,
//         endDate: null,
//         createdBy: '',
//         modifiedBy: '',
//         createdDate: null,
//         modifiedDate: null,
//       },
//     });
//   });

//   it('should handle upsertUserConfig', async () => {
//     const data = {
//       discriminator: '',
//       email: 'test@test.com',
//       id: '',
//       lastOpenedReportId: '',
//       userSetDefaultApp: '',
//       defaultApp: null,
//       orgCode: '',
//       inactiveDate: null,
//       startDate: null,
//       endDate: null,
//       createdBy: '',
//       modifiedBy: '',
//       createdDate: null,
//       modifiedDate: null,
//     };
//     const url = 'http://example.com';
//     const token = 'abc123';
//     // const data = { id: '123', name: 'Test User' };
//     (axios.get as jest.Mock).mockResolvedValue({ data } as AxiosResponse<UserConfig>);

//     const result = await store.dispatch(upsertUserConfig({ url, token, data }));
//     expect(commonSlice.reducer(store.getState().common, result)).toEqual({
//       openAlert: false,
//       type: 'error',
//       status: 'idle',
//       content: '',
//       error: '',
//       userConfig: {
//         discriminator: '',
//         email: '',
//         id: '',
//         lastOpenedReportId: '',
//         userSetDefaultApp: '',
//         defaultApp: null,
//         orgCode: '',
//         inactiveDate: null,
//         startDate: null,
//         endDate: null,
//         createdBy: '',
//         modifiedBy: '',
//         createdDate: null,
//         modifiedDate: null,
//       },
//     });
//   });
});

