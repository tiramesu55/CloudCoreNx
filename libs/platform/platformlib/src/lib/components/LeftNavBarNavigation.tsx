import React, {  useEffect, useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  List,
  CssBaseline,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { makeStyles, withStyles } from "@mui/styles";
import { useLocation, useHistory } from "react-router-dom";
import theme from "../themes";
import { UnsavedData } from "./UnsavedData";
import { getOrgFormModified, getSiteFormModified, getUserFormModified } from '@cloudcore/redux-store';
import {  useAppSelector } from "../hooks/hooks";

const drawerWidth = 240;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  //...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "#4F10A5",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  paper: {
    backgroundColor: "#4F10A5 !important",
    marginTop: "64px",
    position: "absolute",
    color: "white",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
    fontSize: theme.typography.subtitle1.fontSize,
    marginLeft: theme.spacing(4),
    fontWeight: 600,
  },
});

const CustomDrawerCss = withStyles(() => ({
  "@global": {
    ".css-1o9ae5h-MuiPaper-root-MuiDrawer-paper": {
      position: "absolute !important",
      height: "calc(100% - 64px) !important",
    },
    /* "*::-webkit-scrollbar-button": {
      height: "0px",
    },
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      borderRadius: "10px",
    }, */
  },
}))(() => null);

interface Props {
  children?: JSX.Element | null;
}

export const MiniDrawer = (props: Props) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const orgFormModified : boolean = useAppSelector(getOrgFormModified);
  const siteFormModified : boolean = useAppSelector(getSiteFormModified);
  const userFormModified : boolean = useAppSelector(getUserFormModified);

  const handleDialogBox = (open: boolean) => {
    setDialogBoxOpen(open);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const [selectedLink, setSelectedLink] = React.useState(() => {
    return location.pathname.includes("/user") ? 1 : 0;
  });

  useEffect(() => {
    setSelectedLink(location.pathname.includes("/user") ? 1 : 0);
  }, [location]);

  const buttonProps = (value: any) => ({
    selected: selectedLink === value,
    onClick: () => setSelectedLink(value),
  });

  const StyledList = styled(List)({
    // selected and (selected + hover) states
    "&& .Mui-selected, && .Mui-selected:hover": {
      backgroundColor: "#240753",
      "&, & .MuiListItemIcon-root": {
        color: "pink",
      },
    },
  });

  return (
    <Box sx={{ display: "flex" }}>
      {
        <UnsavedData
          open={dialogBoxOpen}
          location={redirectUrl}
          handleLeave={handleDialogBox}
        />
      }
      <CssBaseline />
      <CustomDrawerCss />
      <Drawer
        variant="permanent"
        open={open}
        classes={{ paper: classes.paper }}
      >
        <DrawerHeader>
          {!open ? (
            <IconButton onClick={handleDrawerOpen}>
              <MenuIcon fontSize="large" sx={{ color: "white" }} />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon sx={{ color: "white" }} />
              ) : (
                <ChevronLeftIcon sx={{ color: "white" }} />
              )}
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <StyledList>
          <List>
            {/* 
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => ( */}
            <li
              onClick={() => {
                if (
                  // location.pathname.includes("/editUser") ||
                  // location.pathname.includes("/editOrganization") ||
                  // location.pathname.includes("/addUser") ||
                  // location.pathname.includes("/addOrganization")
                  orgFormModified === true ||
                  siteFormModified === true ||
                  userFormModified === true
                ) {
                  setDialogBoxOpen(true);
                  setRedirectUrl("dashboard");
                } else {
                  history.replace("/");
                }
              }}
              style={{
                textDecoration: "none",
                color: "white",
                padding: "0px",
                display: "block",
              }}
            >
              <Tooltip
                title={!open ? "Dashboard" : ""}
                aria-label={!open ? "Dashboard" : ""}
                placement="right"
                arrow
                disableFocusListener={true}
              >
                <ListItemButton
                  {...buttonProps(0)}
                  disableRipple={true}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <DashboardIcon sx={{ color: "white" }} />
                  </ListItemIcon>

                  <ListItemText
                    primary={"Dashboard"}
                    color="secondary"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </li>
            <li
              onClick={() => {
                if (
                  // location.pathname.includes("/editUser") ||
                  // location.pathname.includes("/editOrganization") ||
                  // location.pathname.includes("/addUser") ||
                  // location.pathname.includes("/addOrganization")
                  orgFormModified === true ||
                  siteFormModified === true ||
                  userFormModified === true
                ) {
                  setDialogBoxOpen(true);
                  setRedirectUrl("users");
                } else {
                  history.push("/user");
                }
              }}
              style={{ textDecoration: "none", color: "white", padding: "0px" }}
            >
              <Tooltip
                title={!open ? "Users" : ""}
                aria-label={!open ? "Users" : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  {...buttonProps(1)}
                  disableRipple={true}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <PeopleIcon sx={{ color: "white" }} />
                  </ListItemIcon>

                  <ListItemText
                    primary={"Users"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </li>
            {/* ))} */}
          </List>
        </StyledList>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <DrawerHeader />
        {props.children}
      </Box>
    </Box>
  );
};

