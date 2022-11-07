import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { theme } from '../themes'
import { Card } from './Card';

describe('Card', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider theme={theme} >
         <Card >text</Card>
     </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
