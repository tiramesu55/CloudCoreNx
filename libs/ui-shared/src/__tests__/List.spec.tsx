/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { List } from '../lib/List/List';
import { createTheme, ThemeProvider } from '@mui/material';
import { Theme } from '@mui/material/styles';

describe('List', () => {
  const theme: Theme = createTheme();
  it('should render List component', async () => {
    const props = {
      label: 'Organizations',
      name: 'name',
      idSelected: 'wag',
      data: [
        {
          name: 'Walgreens',
          address: {
            street: '5304 claridge square',
            city: 'Atlanta',
            zip: '30338',
            state: 'Georgia',
          },
          inactiveDate: null,
        },
      ],
    };
    render(
      <ThemeProvider theme={theme}>
        <List
          {...props}
          changeSelectedId={() => {}}
        />
      </ThemeProvider>
    );
    expect(screen.getByRole('toolbar')).toHaveTextContent('Listed Organizations')
    // expect(screen.getByText("Organizations")).toBeVisible();
    // expect(screen.findByDisplayValue("Address")).toBeVisible();
    const elem = await screen.findAllByText("Address");
    console.log(elem[0])
    // expect(screen.getAllByText("Status")).toBeVisible();

    props.data.forEach((item) => {
      expect(screen.getByText(item.name)).toBeVisible();
      const address = `${item.address.street}, ${item.address.city}`;
      expect(screen.getByText(address)).toBeVisible();
      const activeStatus = item.inactiveDate ? 'Not Active' : 'Active';
      expect(screen.getByText(activeStatus)).toBeVisible();
    });
  });
});
