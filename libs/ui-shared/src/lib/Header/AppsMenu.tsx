import { Box, Typography, Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme, Theme } from '@mui/material/styles';
import { useContext } from 'react';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import betaIcon from '../assets/betaIcon.png';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

interface AppsMenuProps {
  title: string;
  betaIcon?: boolean;
}

const AppsMenu = (props: AppsMenuProps) => {
  const history = useHistory();
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig = useContext(ConfigCtx)!;
  const { permissions } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const apps = [
    {
      name: 'ANALYTICS',
      url: config.isMainApp ? '/analytics' : '/',
      permission: permissions?.analytics && permissions?.analytics.length > 0,
    },
    {
      name: 'MARKETPLACE',
      url: config.isMainApp ? '/marketplace/' : '/',
      permission:
        permissions?.marketplace && permissions?.marketplace.length > 0,
    },
    {
      name: 'PLATFORM',
      url: config.isMainApp ? '/platform' : '/',
      permission: permissions?.admin && permissions?.admin.length > 0,
    },
  ];

  //this filters out current app from AppsMenuChoices, But the title needs to match a name of the app
  const availableApps = apps.filter(
    (app) => app.name.toLowerCase() !== props.title.toLowerCase()
  );

  const useStyles = makeStyles((theme: Theme) => ({
    menuItems: {
      position: 'relative',
      fontSize: theme.typography.subtitle1.fontSize,
      display: 'block',
      color: 'inherit',
      textDecoration: 'none',
    },
    subMenuList: {
      padding: theme.spacing(1),
      fontSize: theme.typography.body1.fontSize,
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: '#E6E8F3',
      },
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    disabledList: {
      padding: theme.spacing(1),
      fontSize: theme.typography.body1.fontSize,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#b7b7b7',
    },
    dropdown: {
      position: 'absolute',
      right: '0',
      left: 'auto',
      zIndex: '9999',
      width: 'max-content',
      padding: '0',
      listSstyle: 'none',
      backgroundColor: '#fff',
      borderRadius: '0.5rem',
      top: '100%',
      boxShadow: '0px 2px 5px #333',
      border: '0px solid grey',
      '.dropdown-submenu': {
        position: 'absolute',
        left: '100%',
      },
    },
  }));

  const classes = useStyles();
  const ref: any = useRef();
  const [dropdown, setDropdown] = useState(false);
  const onMouseEnter = () => {
    setDropdown(true);
  };

  const onMouseLeave = () => {
    setDropdown(false);
  };

  const closeDropdown = () => {
    dropdown && setDropdown(false);
  };

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

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center' }}
      className={classes.menuItems}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
    >
      <Button
        aria-haspopup="menu"
        disableFocusRipple={true}
        disableTouchRipple={true}
        aria-expanded={dropdown ? 'true' : 'false'}
        onClick={() => setDropdown((prev) => !prev)}
        style={{
          color: dropdown ? '#8141f2' : '#58595B',
          fontSize: theme.typography.h6.fontSize,
          fontWeight: 'normal',
          textTransform: 'inherit',
          display: 'flex',
          padding: '0px',
        }}
      >
        <Typography
          sx={{
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            height: '64px',
            cursor: 'default',
            fontWeight: 'normal',
            pl: theme.spacing(2),
          }}
          component="span"
          variant="h5"
        >
          {props.title}
          {props.betaIcon ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component={'img'}
                src={betaIcon}
                alt="Beta version"
                sx={{
                  background: '#6513f0',
                  border: theme.palette.primary.light,
                  padding: '5px',
                  borderRadius: '5px',
                  marginLeft: theme.spacing(1.5),
                  height: 'fit-content',
                }}
              />
            </Box>
          ) : (
            <Box component={'span'}></Box>
          )}
          <Box>
            <KeyboardArrowDownIcon sx={{ mt: 1 }} />
          </Box>
        </Typography>
      </Button>

      <Box
        className={classes.dropdown}
        sx={dropdown ? { display: 'block' } : { display: 'none' }}
      >
        {availableApps.map((app) => {
          return (
            <Box
              component={'button'}
              onClick={(e: React.MouseEvent) => {
                app.permission ? history.push(app.url) : e.preventDefault();
              }}
              key={app.name}
              className={
                app.permission ? classes.subMenuList : classes.disabledList
              }
            >
              {app.name}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AppsMenu;
