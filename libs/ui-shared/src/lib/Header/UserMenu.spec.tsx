import { UserMenu } from './UserMenu';
import { ThemeProvider } from '@mui/material/styles';
import { render, screen, fireEvent } from '@testing-library/react';
import { theme } from '../themes'

const userMenuProps = {
    "userName": "Admin Wag",
    "userInitials": "AW",
    "userMenuList": [
        {
            "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxMS45OTkiIHZpZXdCb3g9IjAgMCAxNiAxMS45OTkiPg0KICA8cGF0aCBpZD0ic2lnbi1vdXQiIGQ9Ik0zLDY0SDUuNjI1QS4zNzYuMzc2LDAsMCwxLDYsNjQuMzc1di43NWEuMzc2LjM3NiwwLDAsMS0uMzc1LjM3NUgzQTEuNSwxLjUsMCwwLDAsMS41LDY3djZBMS41LDEuNSwwLDAsMCwzLDc0LjVINS42MjVBLjM3Ni4zNzYsMCwwLDEsNiw3NC44NzR2Ljc1QS4zNzYuMzc2LDAsMCwxLDUuNjI1LDc2SDNhMywzLDAsMCwxLTMtM1Y2N0EzLDMsMCwwLDEsMyw2NFptNy4yMjIuNjA5LS42MTIuNjEyYS4zNzEuMzcxLDAsMCwwLC4wMDYuNTM0bDMuNTM0LDMuNDMxSDUuMzc1QS4zNzYuMzc2LDAsMCwwLDUsNjkuNTYydi44NzVhLjM3Ni4zNzYsMCwwLDAsLjM3NS4zNzVoNy43NzVMOS42MTUsNzQuMjRhLjM3Ni4zNzYsMCwwLDAtLjAwNi41MzRsLjYxMi42MTJhLjM3NS4zNzUsMCwwLDAsLjUzMSwwbDUuMTM3LTUuMTI1YS4zNzUuMzc1LDAsMCwwLDAtLjUzMWwtNS4xMzctNS4xMjVBLjM3OC4zNzgsMCwwLDAsMTAuMjIxLDY0LjYwOVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTY0KSIgZmlsbD0iIzAwYWVlZiIvPg0KPC9zdmc+DQo=",
            "label": "Logout",
            "onClick": jest.fn()
        }
    ]
};
describe('UserMenu', () => {
  it('should render UserMenu', async () => {
    render(
      <ThemeProvider theme={theme} >
        <UserMenu
            userMenuProps={userMenuProps}        
        />
       </ThemeProvider>
    );
    const initials = screen.getByText(userMenuProps.userInitials);      
    expect(initials).toBeTruthy();
    
    let menu = screen.queryByTestId('initials');
    expect(menu).toBeNull()

    const avatar = screen.queryByTestId('initials-avatar');
    
    expect(avatar).not.toBeNull()
    avatar && fireEvent.click(avatar);

    menu = screen.queryByTestId('initials');
    expect(menu).not.toBeNull();
    if(menu){
        expect(window.getComputedStyle(menu).display).toEqual('block');
    }
  });
});
