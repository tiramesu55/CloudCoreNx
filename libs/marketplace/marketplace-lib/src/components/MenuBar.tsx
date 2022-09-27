import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';

export const MenuBar: React.FC  = () => {
  debugger;
const pages = ['Component1', 'Compopnent2'];
const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
          <Menu
              id="menu-appbar"  anchorEl={anchorElNav}  anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}

              >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} >
                  <Typography sx={{ ml: 3, color: "#8141f2", display: "flex", alignItems: "center", fontSize: "18px" }}>{page}</Typography>
                </MenuItem>
              ))}
          </Menu>
  )
}