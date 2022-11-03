import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface navigationProps {
  navigationProps: navigation[];
}

interface navigation {
  label: string;
  route?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  subMenuList?: subMenuListProps[];
}

interface subMenuListProps {
  label: string;
  onClick?: () => void;
  route?: string;
}
const NavBar = (props: navigationProps) => {
  const history = useHistory();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [index, setIndex] = useState<null | number>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuItemClick = (route?: string) => {
    if (route) {
      history.push(route);
    }
    setAnchorEl(null);
  };

  const style = {
    navLinkIcon: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
      fontSize: theme.typography.subtitle1.fontSize,
      marginLeft: theme.spacing(4),
      //fontWeight: 600,
    },
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {props.navigationProps.map((item, ind) =>
        item.subMenuList ? (
          <Box
            sx={{
              ml: 3,
              display: 'flex',
              alignItems: 'center',
              height: '64px',
            }}
            onMouseEnter={(e) => {
              setAnchorEl(e.currentTarget);
              setIndex(ind);
            }}
            onMouseLeave={(e) => {
              setAnchorEl(null);
              setIndex(null);
            }}
            key={item.label}
          >
            <Typography
              id={`${item.label}-menu`}
              variant="h6"
              key={item.label}
              sx={{
                color: openMenu && index === ind ? '#8141f2' : '#58595B',
                display: 'flex',
                alignItems: 'center',
                height: '64px',
                cursor: 'default',
                fontWeight: 'normal',
              }}
            >
              {item.label}
              <Box>
                <KeyboardArrowDownIcon sx={{ mt: 1 }} />
              </Box>
            </Typography>
            {index === ind && (
              <Menu
                id={`${item.label}-menu`}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={() => setAnchorEl(null)}
                autoFocus={false}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                  onMouseLeave: () => setAnchorEl(null),
                }}
                sx={{
                  width: '252px',
                  '& .MuiMenu-list': {
                    paddingTop: '0px',
                    paddingBottom: '0px',
                  },
                }}
              >
                {item.subMenuList.map((sub, indx) => (
                  <MenuItem
                    onClick={() => {
                      handleMenuItemClick(sub?.route);
                      sub?.onClick?.();
                    }}
                    key={indx}
                    sx={{
                      width: '252px',
                      '&:hover': {
                        backgroundColor: theme.palette.menuHoverColor.main,
                      },
                      '&:active': {
                        backgroundColor: theme.palette.menuHoverColor.main,
                      },
                      backgroundColor: theme.palette.secondary.main,
                    }}
                  >
                    {sub.label}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
        ) : (
          <NavLink
            style={style.navLinkIcon}
            to={item.route}
            key={item.route}
            exact
            activeClassName="selected"
            onClick={item.onClick}
            activeStyle={{
              color: theme.palette.primary.main,
            }}
          >
            {item.label}
          </NavLink>
        )
      )}
    </Box>
  );
};

export default NavBar;
