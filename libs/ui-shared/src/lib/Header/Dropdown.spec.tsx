import Dropdown from './Dropdown';
import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { theme } from '../themes'

const dropDownProps = [
  {
      "label": "Shipped Report"
  },
  {
      "label": "Cancellations Report"
  },
  {
      "label": "Shipping Insights(beta)"
  },
  {
      "label": "Cancellations Dashboard(beta)"
  }
];
describe('Dropdown', () => {
  it('should render Dropdown visibile', () => {
    render(
      <ThemeProvider theme={theme} >
        <Dropdown
          submenus={dropDownProps}
          dropdown={true} 
        />
       </ThemeProvider>
    );
    const doc = document.getElementsByClassName('dropdown')
    const docItem = doc.item(0);
    if(docItem){
      expect(window.getComputedStyle(docItem).display).toEqual('block');
      dropDownProps.forEach( ({ label }): void => {
        const inputNode = screen.getByText(label);      
        expect(inputNode).toBeTruthy();
      })
    }
  });

  it('should render Dropdown not visibile', () => {
    render(
      <ThemeProvider theme={theme} >
        <Dropdown
          submenus={dropDownProps}
          dropdown={false} 
        />
       </ThemeProvider>
    );
    const doc = document.getElementsByClassName('dropdown')
    const docItem = doc.item(0);
    if(docItem){
      expect(window.getComputedStyle(docItem).display).toEqual('none');
      dropDownProps.forEach( ({ label }): void => {
        const inputNode = screen.getByText(label);      
        expect(inputNode).toBeTruthy();
      })
    }
  });
});