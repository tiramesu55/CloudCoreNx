import { AppBar, Toolbar, Typography, Divider, Box } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import theme from '../themes';
import { useState } from 'react';
import {ReportIssue} from './ReportIssue';
import {UserMenu} from './UserMenu';
import NavBar from './NavBar';
import betaIcon from './assets/betaIcon.png';
import reportIssueIcon from './assets/report-issue.svg';

interface headerProps {
  title: string;
  logo?: logoProps;
  betaIcon?: boolean;
  navLinkMenuList?: navLinkMenuListProps[];
  reportIssue?: boolean;
  userMenu?: userMenuProps;
  userMenuList?: userMenuListProps[];
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
  onClick?: () => void;
  subMenuList?: subMenuListProps[];
}

interface subMenuListProps {
  label: string;
  onClick: () => void;
}

export const Header = (props: headerProps) => {
  /* Report Issue Code */
  const [isOpen, setIsOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleReportIssueDialogOpen = () => {
    setIsOpen(true);
  };

  const handleReportIssueDialogClose = () => {
    setIsOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [index, setIndex] = useState<null | number>(null);
  const handleClose = () => {
    setAnchorEl(null);
    setIndex(null);
  };
  /* End of Report Issue */
  const open = Boolean(anchorEl);
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
      // fontWeight: 600,
    },
    appBar: {
      border: '1px',
      borderColor: theme.palette.navbarBorder.main,
      borderBottom: `1px solid ${theme.palette.navbarBorder.main}`,
      margin: '0px',
      boxShadow: '0px 3px 6px #0000000D',
      background: theme.palette.secondary.main,
      zIndex: theme.zIndex.drawer + 1,
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
            },
          ],
        },
      ];

  return (
    <Box>
      <AppBar
        style={style.appBar}
        position="relative"
        sx={{ backgroundColor: theme.palette.secondary.main, zIndex: '2000' }}
      >
        <Toolbar
          style={style.Toolbar}
          sx={{ width: '100%', p: 0, display: 'flex', alignItems: 'center' }}
        >
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { md: 'flex', alignItems: 'center' } }}
            >
              <img
                src={props.logo?.img}
                alt="NexiaLogo"
                style={style.layoutLogo}
              />
            </Typography>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Box
              sx={{
                justifyContent: 'left',
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
              }}
              style={style.navLinkIconActive}
            >
              {props.title}
            </Box>
            {props.betaIcon ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component={'img'}
                  src={betaIcon}
                  alt="Beta version"
                  sx={{
                    background: '#6513f0',
                    border: '1px solid #8141f2',
                    padding: '5px',
                    borderRadius: '5px',
                    marginLeft: '13px',
                    height: 'fit-content',
                    marginTop: '4px',
                    marginRight: '12px',
                  }}
                />
              </Box>
            ) : (
              <Box component={'span'}></Box>
            )}
            <NavBar navigationProps={navLinkList} />
            {/* manu should go there and be done ad a specific library component */}
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
