import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { theme } from '../themes'
import { InfoCard } from './InfoCard';

describe('InfoCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider theme={theme} >
        <InfoCard title={''} count={0} image={''} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
