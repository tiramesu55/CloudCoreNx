import { Box, Typography, Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme, Theme } from '@mui/material/styles';
import { useContext } from 'react';
import {
  ConfigCtx,
  IConfig,
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import betaIcon from '../assets/betaIcon.png';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

interface AppsMenuProps {
  title: string;
  betaIcon?: boolean;
  isFormModified?: boolean;
  unSavedData?: (open: boolean, app: string) => void;
}

const AppsMenu = (props: AppsMenuProps) => {
  const history = useHistory();
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig = useContext(ConfigCtx) as IConfig;
  const { permissions } = useClaimsAndSignout() as UseClaimsAndSignout;
  const apps = [
    {
      name: 'Enterprise Analytics',
      url: config.isMainApp ? '/analytics' : '/',
      permission: (permissions.get('analytics') ?? []).length > 0,
    },
    {
      name: 'Marketplace',
      url: config.isMainApp ? '/marketplace/' : '/',
      permission: (permissions.get('marketplace') ?? []).length > 0,
    },
    {
      name: 'Platform Management',
      url: config.isMainApp ? '/platform' : '/',
      permission: (permissions.get('admin') ?? []).length > 0,
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

  const handleAppRouting = (app: string) => {
    if (props.isFormModified && config.isMainApp) {
      props?.unSavedData?.(true, app);
    } else {
      history.push(app);
    }
  };

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', ml: 2, mr: 3 }}
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
        sx={{
          color: dropdown ? '#8141f2' : '#58595B',
          fontSize: theme.typography.h6.fontSize,
          fontWeight: 'normal',
          textTransform: 'inherit',
          display: 'flex',
          padding: '0px',
          '&:hover': {
            backgroundColor: 'transparent',
          },
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
          {Array.from(permissions).filter(([app, value]) => {
            return value;
          }).length > 1 && dropdown ? (
            <Box>
              <KeyboardArrowUpIcon sx={{ mt: 1 }} />
            </Box>
          ) : (
            <Box>
              <KeyboardArrowDownIcon sx={{ mt: 1 }} />
            </Box>
          )}
        </Typography>
      </Button>

      <Box
        className={`dropdown browserSpecific`}
        sx={dropdown ? { display: 'block' } : { display: 'none' }}
      >
        {/* filter is a temporary solution to the missing or incorrect disabledList sheet.  I hide the  */}
        {availableApps
          .filter((app) => app.permission)
          .map((app) => {
            return (
              <Box
                component={'button'}
                onClick={(e: React.MouseEvent) => {
                  app.permission
                    ? handleAppRouting(app.url)
                    : e.preventDefault();
                }}
                key={app.name}
                className={
                  app.permission ? 'subMenuList' : `disabledList subMenuList`
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
