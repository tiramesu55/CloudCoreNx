import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { theme } from '../themes'
import { UnsavedData } from './UnSavedData';
import { ConfigContext } from '@cloudcore/okta-and-config';
import { BrowserRouter } from 'react-router-dom';

describe('UnSavedData', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ConfigContext isMainApp={true}>
          <BrowserRouter>
            <ThemeProvider theme={theme} >
              <UnsavedData
                open={false}
                handleLeave={function (open: boolean): void {
                  throw new Error('Function not implemented.');
                }}
              />
            </ThemeProvider>
          </BrowserRouter>
      </ConfigContext>
    );
    expect(baseElement).toBeTruthy();
  });
});
