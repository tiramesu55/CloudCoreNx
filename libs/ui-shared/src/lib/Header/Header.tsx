import { AppBar, Toolbar, Typography, Divider, Box } from '@mui/material';
import { useContext, useState } from 'react';
import { ReportIssue } from '../ReportIssue/ReportIssue';
import { UserMenu } from './UserMenu';
import reportIssueIcon from '../assets/report-issue.svg';
import { useTheme } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import AppsMenu from './AppsMenu';
import { ConfigCtx, IConfig } from '@cloudcore/okta-and-config';
import NavBar from './NavBar';
import Maintenance from './Maintenance';
import { NavLink } from 'react-router-dom';
import { IAppsMenu } from '@cloudcore/common-lib';

interface headerProps {
  title: string;
  logo?: logoProps;
  betaIcon?: boolean;
  navLinkMenuList?: navLinkMenuListProps[];
  marketplaceConfiguration?: React.ReactNode;
  reportIssue?: boolean;
  userMenu?: userMenuProps;
  userMenuList?: userMenuListProps[];
  maintenance?: maintenanceProps;
  isFormModified?: boolean;
  unSavedData?: (open: boolean, app: string) => void;
  appsMenu?: IAppsMenu;
}

interface logoProps {
  img: string | undefined;
  path?: string;
}

interface userMenuProps {
  userName: string;
  userInitials: string;
}

interface userMenuListProps {
  icon: string;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

interface navLinkMenuListProps {
  label: string;
  route?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  subMenuList?: subMenuListProps[];
}

interface subMenuListProps {
  label: string;
  route?: string;
  onClick?: () => void;
  betaIcon?: boolean;
}

interface maintenanceProps {
  showMaintenance: boolean;
  handleMaintenanceDialog: (value: boolean) => void;
}

export const Header = (props: headerProps) => {
  /* Report Issue Code */
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { marketplaceConfiguration } = props;
  const config: IConfig = useContext(ConfigCtx)!;
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const handleReportIssueDialogOpen = () => {
    setIsOpen(true);
  };

  const handleReportIssueDialogClose = () => {
    setIsOpen(false);
  };

  /* End of Report Issue */

  const style = {
    layoutLogo: {
      width: '100%',
      maxWidth: '163px',
      maxHeight: '41px',
    },
    layoutDefenceLogo: {
      width: '60px',
    },
    link: {
      color: theme.palette.text.primary,
      paddingInline: theme.spacing(2),
    },
    userIcon: {
      cursor: 'pointer',
      color: 'grey',
    },
    grid: {
      display: 'grid',
    },
    Toolbar: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
    },
    navLinkIconActive: {
      textDecoration: 'none',
      color: theme.palette.primary.main,
      fontSize: theme.typography.subtitle1.fontSize,
      marginLeft: theme.spacing(3),
      //fontWeight: 600,
    },
    appBar: {
      border: '1px',
      borderColor: theme.palette.navbarBorder.main,
      borderBottom: `1px solid ${theme.palette.navbarBorder.main}`,
      margin: '0px',
      boxShadow:
        'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
      background: theme.palette.secondary.main,
      zIndex: theme.zIndex.drawer + 1,
      fontFamily: theme.typography.fontFamily,
      width: '100%',
    },
  };

  const userMenuList = props.userMenuList
    ? props.userMenuList.map((item) => {
        return {
          icon: item.icon,
          label: item.label,
          onClick: item.onClick,
        };
      })
    : [
        {
          icon: '',
          label: '',
          onClick: () => {
            return null;
          },
        },
      ];

  const navLinkList = props.navLinkMenuList
    ? props.navLinkMenuList.map((item) => {
        return {
          label: item.label,
          route: item.route,
          onClick: item.onClick,
          subMenuList: item.subMenuList?.map((item) => {
            return {
              label: item.label,
              onClick: item.onClick,
              route: item.route,
              betaIcon: item.betaIcon,
            };
          }),
        };
      })
    : [
        {
          label: '',
          route: '',
          onClick: () => {
            return null;
          },
          subMenuList: [
            {
              label: '',
              onClick: () => {
                return null;
              },
              route: undefined,
            },
          ],
        },
      ];

  const CustomCss = withStyles((theme) => ({
    '@global': {
      'html, body': {
        height: '100%',
        fontFamily: theme.typography.fontFamily,
        backgroundColor: theme.palette.background.default,
        margin: '0px',
      },
    },
  }))(() => null);

  return (
    <Box>
      <CustomCss />
      <AppBar
        style={style.appBar}
        position="relative"
        sx={{ backgroundColor: theme.palette.secondary.main, zIndex: '2000' }}
      >
        <Toolbar style={style.Toolbar}>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { md: 'flex', alignItems: 'center' } }}
            >
              <NavLink
                to={`/${window.location.pathname.substring(1).split('/')[0]}`}
                exact
              >
                <img
                  src={props.logo?.img}
                  alt="NexiaLogo"
                  style={style.layoutLogo}
                />
              </NavLink>
            </Typography>
            <Divider orientation="vertical" variant="middle" flexItem />
            {config.isMainApp ? (
              <AppsMenu
                title={props.title}
                betaIcon={props.betaIcon}
                isFormModified={props.isFormModified}
                unSavedData={props.unSavedData}
                appsMenu={props.appsMenu}
              />
            ) : (
              <Box
                sx={{
                  justifyContent: 'left',
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  paddingRight: '24px',
                }}
                style={style.navLinkIconActive}
              >
                {props.title}
              </Box>
            )}
            {<NavBar navigationPropsArray={navLinkList} />}
            {marketplaceConfiguration ? marketplaceConfiguration : null}
          </Box>
          <Box sx={{ display: { xs: 'inline-flex', md: 'inline-flex' } }}>
            {props.reportIssue ? (
              <>
                <Box
                  component={'img'}
                  src={reportIssueIcon}
                  alt="Report Issue"
                  onClick={handleReportIssueDialogOpen}
                  sx={{
                    cursor: 'pointer',
                    marginX: theme.spacing(2),
                  }}
                />
                <ReportIssue
                  onClose={handleReportIssueDialogClose}
                  isOpen={isOpen}
                />
              </>
            ) : (
              <Box component={'span'}></Box>
            )}
            {props.title === 'Platform Management' &&
              props.maintenance?.showMaintenance && (
                <Maintenance
                  handleMaintenanceDialog={
                    props.maintenance.handleMaintenanceDialog
                  }
                />
              )}

            <UserMenu
              userMenuProps={{
                userName: props.userMenu ? props.userMenu.userName : '',
                userInitials: props.userMenu ? props.userMenu.userInitials : '',
                userMenuList: userMenuList,
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
