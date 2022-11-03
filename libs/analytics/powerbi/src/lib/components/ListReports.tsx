/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  List,
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useEffect, useState, useContext } from 'react';
import { reportsActions, analyticsStore } from '@cloudcore/redux-store';
import { Box } from '@mui/system';
import { useAppInsightHook } from '@cloudcore/common-lib';
import { BackdropPowerBi } from './BackDrop/Backdrop';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

const drawerWidth = 310;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeIn,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(2)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(0)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export const ListReports = ({
  listReportLoading,
  userName,
  userEmail,
}: {
  listReportLoading: boolean;
  userName: string;
  userEmail: string;
}) => {
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { email, names } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const { useAppSelector } = analyticsStore;
  const { selectReport } = reportsActions;
  const { HandleUserEvent } = useAppInsightHook();
  const { reports, selectedReport } = useAppSelector((state) => state.report);

  const [selectedIndexSet, setSelectedIndexSet] = useState(new Set<number>());
  const [open, setOpen] = useState(true);

  const handleDrawer = () => {
    setOpen(!open);
  };

  const handleClick = (e: any, index: number) => {
    e.stopPropagation();
    // check if drawer is open
    if (!open) {
      setOpen(!open);
    } else if (open) {
      if (selectedIndexSet.has(index)) {
        setSelectedIndexSet(
          (selectedIndexSet) =>
            new Set(Array.from(selectedIndexSet).filter((i) => i !== index))
        );
      } else {
        setSelectedIndexSet(
          (selectedIndexSet) => new Set(selectedIndexSet.add(index))
        );
      }
    }
  };

  const handleReportClick = (e: any, reportId: string, reportName: string) => {
    //debugger;
    e.stopPropagation();
    selectReport({ reportId: reportId, reportName: reportName });
    HandleUserEvent(
      {
        name: userName,
        email: userEmail,
      },
      JSON.stringify({
        reportId: reportId,
        reportName: reportName,
      }),
      'Open Report'
    );
    setOpen(true);
  };

  useEffect(() => {
    openSlaDashboard();
  }, [reports]);

  const openSlaDashboard = () => {
    reports &&
      reports?.map((item, index) => {
        item.reports.map((sub, i) => {
          if (sub.reportName === 'SLA Dashboard') {
            selectReport({
              reportId: sub.reportId,
              reportName: sub.reportName,
            });
            HandleUserEvent(
              {
                name: names ? names[0] + ' ' + names[1] : 'unknownUser',
                email: email ? email : 'unknownEmail',
              },
              JSON.stringify({
                reportId: sub.reportId,
                reportName: sub.reportName,
              }),
              'Open Report'
            );
            setOpen(true);
          }
        });
      });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={open}
        onClick={handleDrawer}
        sx={{ cursor: 'pointer' }}
      >
        <List component="nav" disablePadding sx={{ mt: 8 }}>
          {reports &&
            reports?.map((item, index) => {
              return (
                <List key={index}>
                  <ListItem
                    key={index}
                    button
                    onClick={(e) => {
                      handleClick(e, index);
                    }}
                  >
                    <ListItemIcon>
                      {index % 2 === 0 ? (
                        <Tooltip
                          title={item.name}
                          disableFocusListener
                          disableTouchListener
                          arrow
                          placement="right"
                        >
                          <SettingsIcon />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={item.name}
                          disableFocusListener
                          disableTouchListener
                          arrow
                          placement="right"
                        >
                          <TimelineIcon />
                        </Tooltip>
                      )}
                    </ListItemIcon>

                    <ListItemText primary={item.name} />
                    {selectedIndexSet.has(index) ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItem>

                  <Collapse
                    in={selectedIndexSet.has(index)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding key={index}>
                      {item.reports.map((sub, i) => {
                        return (
                          <ListItem
                            key={sub.reportId}
                            selected={sub.reportId === selectedReport.reportId}
                            sx={{ pl: 7 }}
                          >
                            <ListItemText
                              primary={sub.reportName}
                              onClick={(e) => {
                                handleReportClick(
                                  e,
                                  sub.reportId,
                                  sub.reportName
                                );
                              }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </List>
              );
            })}
        </List>
        <BackdropPowerBi loadingState={listReportLoading} />
      </Drawer>
      <Box
        onClick={handleDrawer}
        sx={{
          display: 'flex',
          mt: 8,
          mr: 1,
          cursor: 'pointer',
        }}
      >
        {open ? (
          <ArrowBackIcon fontSize="large" />
        ) : (
          <MenuIcon fontSize="large" />
        )}
      </Box>
    </Box>
  );
};
