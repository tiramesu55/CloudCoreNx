/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';   
import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { CommonState, commonSlice, getUserConfig, upsertUserConfig, UserConfig } from '../Common/commonSlice';
import axios, { AxiosResponse } from 'axios';
import { StrictMode } from 'react';

import { Provider } from 'react-redux';
import { store } from '../store-main';
import { BrowserRouter } from 'react-router-dom';
import { AnalyticsPowerbi } from '@cloudcore/analytics/powerbi';
import { ConfigCtx, IConfig, OktaCode, ConfigContext } from '@cloudcore/okta-and-config';
import { useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { theme } from '@cloudcore/ui-shared';

import { config, userData, MaintenanceDetails, PlatformApplication, GetSuitesByPermission } from './mocks/index'; 

jest.mock('axios');
// const errorMessage = 'Error retrieving user configuration';
//     axios.get.mockRejectedValue(new Error(errorMessage));


// interface UserConfig {
//     discriminator: string;
//     email: string;
//     id: string;
//     lastOpenedReportId: string;
//     userSetDefaultApp: string;
//     defaultApp: null | string;
//     orgCode: string;
//     inactiveDate: Date | null;
//     startDate: Date | null;
//     endDate: Date | null;
//     createdBy: string;
//     modifiedBy: string;
//     createdDate: Date | null;
//     modifiedDate: Date | null;
//   }
// const store = configureStore({
//     reducer: {
//         common: commonSlice.reducer,
//     },
// });
beforeEach(() => {
    (axios.get as jest.Mock).mockReset();
  });

describe('commonSlice', () => {
    it('should render AnalyticsPowerbi component', async () => {

        (axios.get as jest.Mock).mockImplementation(async (url) => {
            console.log('url', url)
            if (url.indexOf('config') !== -1) {
              return Promise.resolve(config);
            } else if (url.indexOf('GetSuitesByPermission') !== -1) {
                 return Promise.resolve( {data :GetSuitesByPermission});
            } else if (url.indexOf('Maintenance') !== -1) {
                return Promise.resolve({data: MaintenanceDetails});
            } else if (url.indexOf('PlatformApplication') !== -1) {
                return Promise.resolve({data: PlatformApplication});
            } else if (url.indexOf('PlatformUser') !== -1) {
                return Promise.resolve({data: userData});
            } else {
              throw new Error(`Unexpected URL: ${url}`);
            }
          });
      
        //   const result1 = await myFunctionThatCallsAxios(url1);
        //   expect(result1).toEqual(response1.data);
        //   expect(axios.get).toHaveBeenCalledWith(url1);
      
        //   const result2 = await myFunctionThatCallsAxios(url2);
        //   expect(result2).toEqual(response2.data);
        //   expect(axios.get).toHaveBeenCalledWith(url2);

         let container;
        await act(async () => {
            container = render(<ConfigContext>
                <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        <BrowserRouter>
                        <AnalyticsPowerbi />
                        </BrowserRouter>
                    </ThemeProvider>
                </Provider>
            </ConfigContext>)
        });
        
        expect(container).toMatchSnapshot();

        });
    // });

  it('should handle getUserConfig', async () => {
    const result = await store.dispatch(getUserConfig({ url: 'url', token: 'token' }));
    expect(commonSlice.reducer(store.getState().common, result)).toEqual({
      openAlert: false,
      type: 'error',
      status: 'idle',
      content: '',
      error: '',
      userConfig: {
        discriminator: '',
        email: '',
        id: '',
        lastOpenedReportId: '',
        userSetDefaultApp: '',
        defaultApp: null,
        orgCode: '',
        inactiveDate: null,
        startDate: null,
        endDate: null,
        createdBy: '',
        modifiedBy: '',
        createdDate: null,
        modifiedDate: null,
      },
    });
  });

  it('should handle upsertUserConfig', async () => {
    const data = {
      discriminator: '',
      email: 'test@test.com',
      id: '',
      lastOpenedReportId: '',
      userSetDefaultApp: '',
      defaultApp: null,
      orgCode: '',
      inactiveDate: null,
      startDate: null,
      endDate: null,
      createdBy: '',
      modifiedBy: '',
      createdDate: null,
      modifiedDate: null,
    };
    const url = 'http://example.com';
    const token = 'abc123';
    // const data = { id: '123', name: 'Test User' };
    (axios.get as jest.Mock).mockResolvedValue({ data } as AxiosResponse<UserConfig>);

    const result = await store.dispatch(upsertUserConfig({ url, token, data }));
    expect(commonSlice.reducer(store.getState().common, result)).toEqual({
      openAlert: false,
      type: 'error',
      status: 'idle',
      content: '',
      error: '',
      userConfig: {
        discriminator: '',
        email: '',
        id: '',
        lastOpenedReportId: '',
        userSetDefaultApp: '',
        defaultApp: null,
        orgCode: '',
        inactiveDate: null,
        startDate: null,
        endDate: null,
        createdBy: '',
        modifiedBy: '',
        createdDate: null,
        modifiedDate: null,
      },
    });
  });
});

