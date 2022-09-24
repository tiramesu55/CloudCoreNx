import {
  // Drawer,
  List,
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { useTypedSelector } from "../hooks/useTypedSelector";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useEffect, useState } from "react";
import { useActions } from "../hooks/useActions";
import { useOktaAuth } from "@okta/okta-react";
import { Box } from "@mui/system";
import useAppInsightHook from "../hooks/AppInsightHook/AppInsightHook";
import BackdropPowerBi from "./BackDrop/Backdrop";

const drawerWidth = 310;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeIn,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(2)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(0)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const ListReports = ({
  listReportLoading,
  userName,
  userEmail,
}: {
  listReportLoading: boolean;
  userName: string;
  userEmail: string;
}) => {
  const { HandleUserEvent } = useAppInsightHook();
  const { reports, selectedReportId } = useTypedSelector(
    (state) => state.reportReducer
  );
  const { selectReport } = useActions();
  const [selectedIndexSet, setSelectedIndexSet] = useState(new Set<number>());
  const [open, setOpen] = useState(true);

  const handleDrawer = () => {
    setOpen(!open);
  };
  const { config } = useTypedSelector((state) => state.configReducer);

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
  const { oktaAuth } = useOktaAuth();

  const handleReportClick = (e: any, reportId: string) => {
    //debugger;
    e.stopPropagation();

    oktaAuth.session.exists().then(function (exists) {
      if (exists) {
        console.log("session is there");
        selectReport(reportId);
        HandleUserEvent(
          {
            name: userName,
            email: userEmail,
          },
          reportId,
          "SelectReportId"
        );
        setOpen(true);
      } else {
        console.log("Session Expired");
        oktaAuth.signOut({
          postLogoutRedirectUri: config?.postLogoutRedirectUri, // "https://ssotest.walgreens.com/idp/idpLogout",
          revokeAccessToken: true,
        });
      }
    });
  };

  useEffect(() => {
    openSlaDashboard();
  }, [reports]);

  const openSlaDashboard = () => {
    reports?.map((item, index) => {
      item.reports.map((sub, i) => {
        if (sub.reportName === "SLA Dashboard") {
          oktaAuth
            .getUser()
            .then((info) => {
              selectReport(sub.reportId);
              HandleUserEvent(
                {
                  name: info
                    ? info.family_name + " " + info.given_name
                    : "unknownUser",
                  email: info ? info.email : "unknownEmail",
                },
                sub.reportId,
                "SelectReportId"
              );
              setOpen(true);
            })
            .catch((e) => {
              console.log("Session Expired");
              oktaAuth.signOut({
                postLogoutRedirectUri: config?.postLogoutRedirectUri, // "https://ssotest.walgreens.com/idp/idpLogout",
                revokeAccessToken: true,
              });
            });
        }
      });
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={open}
        onClick={handleDrawer}
        sx={{ cursor: "pointer" }}
      >
        <List component="nav" disablePadding sx={{ mt: 8 }}>
          {reports?.map((item, index) => {
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
                          selected={sub.reportId === selectedReportId}
                          sx={{ pl: 7 }}
                        >
                          <ListItemText
                            primary={sub.reportName}
                            onClick={(e) => {
                              handleReportClick(e, sub.reportId);
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
          display: "flex",
          mt: 8,
          mr: 1,
          cursor: "pointer",
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

export default ListReports;
