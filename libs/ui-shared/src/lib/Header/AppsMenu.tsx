import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import betaIconImg from '../assets/betaIcon.png';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { IAppData, IAppsMenu } from '@cloudcore/common-lib';

interface AppsMenuProps {
  title: string;
  betaIcon?: boolean;
  isFormModified?: boolean;
  unSavedData?: (open: boolean, app: string) => void;
  appsMenu?: IAppsMenu;
}

const AppsMenu = (props: AppsMenuProps) => {
  const { title, betaIcon, isFormModified, unSavedData, appsMenu } = props;
  const history = useHistory();
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig = useContext(ConfigCtx) as IConfig;
  const { permissions } = useClaimsAndSignout() as UseClaimsAndSignout;

  //this filters out current app from AppsMenuChoices, But the title needs to match a name of the app
  const availableApps = appsMenu?.appsData?.filter(
    (app) => app.name.toLowerCase() !== props.title.toLowerCase()
  );

  const defaultApp = appsMenu?.appsData?.find((app) => app.defaultApp);
  const defaultAppStatus = appsMenu?.defaultAppStatus;

  useEffect(() => {
    if (defaultAppStatus === 'error' || defaultAppStatus === 'success') {
      setLoader(false);
    }
  }, [defaultApp, defaultAppStatus]);

  const useStyles = makeStyles((theme: Theme) => ({
    menuItems: {
      position: 'relative',
      fontSize: theme.typography.subtitle1.fontSize,
      display: 'block',
      color: 'inherit',
      textDecoration: 'none',
    },
    defaultApp: {
      display: 'none',
      marginLeft: theme.spacing(2),
      '&:hover': {
        display: 'block',
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

  const [loader, setLoader] = useState(false);
  const AppMenu = useMemo(() => {
    const closeDropdown = () => {
      dropdown && setDropdown(false);
    };
    const handleAppRouting = (app: string) => {
      if (isFormModified && config.isMainApp) {
        unSavedData?.(true, app);
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
            {title}
            {betaIcon ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component={'img'}
                  src={betaIconImg}
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
            }).length > 1 &&
              (dropdown ? (
                <Box>
                  <KeyboardArrowUpIcon sx={{ mt: 1 }} />
                </Box>
              ) : (
                <Box>
                  <KeyboardArrowDownIcon sx={{ mt: 1 }} />
                </Box>
              ))}
          </Typography>
        </Button>

        <Box
          className={`dropdown browserSpecific`}
          sx={dropdown ? { display: 'block' } : { display: 'none' }}
        >
          {/* filter is a temporary solution to the missing or incorrect disabledList sheet.  I hide the  */}

          {availableApps?.map((app) => {
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
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                  {app.name}
                </Box>
                {app.defaultApp ? (
                  <Box
                    component={'span'}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <Tooltip title={'Default App'} placement="bottom-start">
                      <StarBorderRoundedIcon
                        sx={{
                          color: theme.palette.warning.main,
                          ml: 2,
                          cursor: 'default',
                        }}
                      ></StarBorderRoundedIcon>
                    </Tooltip>
                  </Box>
                ) : (
                  <Box
                    component="span"
                    className="defaultApp"
                    onClick={async (e: any) => {
                      e.stopPropagation();
                      setLoader(true);
                      app.markAsDefaultApp(app.appCode);
                    }}
                    ml={2}
                  >
                    {loader ? (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress
                          size={theme.spacing(2.5)}
                          sx={{ cursor: 'default', ml: 0.5 }}
                        />
                      </Box>
                    ) : (
                      <Tooltip
                        title={
                          <Box
                            sx={{ fontSize: theme.typography.body2.fontSize }}
                          >
                            Select as Default App
                          </Box>
                        }
                        placement="bottom-start"
                      >
                        <StarBorderRoundedIcon
                          sx={{
                            color: theme.palette.text.primary,
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }, [
    availableApps,
    betaIcon,
    classes.menuItems,
    config.isMainApp,
    dropdown,
    history,
    isFormModified,
    loader,
    permissions,
    theme,
    title,
    unSavedData,
  ]);
  return <>{AppMenu}</>;
};

export default AppsMenu;
