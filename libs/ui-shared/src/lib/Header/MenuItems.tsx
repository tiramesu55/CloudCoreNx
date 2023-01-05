import React, { useState, useEffect, useRef } from 'react';
import Dropdown from './Dropdown';
import { NavLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { navigationProps } from './NavBar';
import { Theme, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

interface Props {
  navigationProps: navigationProps;
}

const useStyles = makeStyles((theme: Theme) => ({
  navLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    fontSize: theme.typography.subtitle1.fontSize,
    marginRight: theme.spacing(3),
    fontFamily: theme.typography.fontFamily,
  },
  menuItems: {
    position: 'relative',
    fontSize: theme.typography.subtitle1.fontSize,
    display: 'inherit',
    color: 'inherit',
    textDecoration: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const MenuItems = (props: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [dropdown, setDropdown] = useState(false);
  const ref: any = useRef();

  useEffect(() => {
    const handler = (event: any) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    setDropdown(true);
  };

  const onMouseLeave = () => {
    setDropdown(false);
  };

  const closeDropdown = () => {
    dropdown && setDropdown(false);
  };

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', mr: 1 }}
      className={classes.menuItems}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
    >
      {props.navigationProps &&
      props.navigationProps.label &&
      props.navigationProps.subMenuList ? (
        <>
          <Button
            aria-haspopup="menu"
            disableFocusRipple={true}
            disableTouchRipple={true}
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={() => setDropdown((prev) => !prev)}
            sx={{
              color: dropdown ? '#8141f2' : '#58595B',
              fontSize: theme.typography.h6.fontSize,
              fontWeight: 'normal',
              textTransform: 'inherit',
              display: 'flex',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            {props.navigationProps.label}
            {dropdown ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Button>
          <Dropdown
            submenus={props.navigationProps.subMenuList}
            dropdown={dropdown}
          />
        </>
      ) : (
        props.navigationProps &&
        props.navigationProps.route && (
          <NavLink
            to={props.navigationProps.route}
            exact
            key={props.navigationProps.route}
            activeClassName="selected"
            className={classes.navLink}
            activeStyle={{
              color: theme.palette.primary.main,
            }}
            onClick={props.navigationProps.onClick}
          >
            {props.navigationProps.label}
          </NavLink>
        )
      )}
    </Box>
  );
};

export default MenuItems;
