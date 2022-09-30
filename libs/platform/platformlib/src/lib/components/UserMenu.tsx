/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, Fragment, useEffect, useContext } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import theme from "../themes";
import User from "../images/user.svg";
import SignOut from "../images/sign-out.svg";
import { useOktaAuth } from "@okta/okta-react";
import { ConfigCtx, IConfig, useClaimsAndSignout } from "@cloudcore/okta-and-config";

export const UserMenu = () => {
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const { oktaAuth, authState } = useOktaAuth();   // needs to be removed and replaced with getClaims
 
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig  = useContext(ConfigCtx)!;   // at this point config is not null (see app)
  const {signOut, names, initials } = useClaimsAndSignout( config.logoutSSO,config.postLogoutRedirectUri);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const style = {
    MenuItem: {
      color: theme.palette.userMenuColor.main,
      hover: {
        "&:hover": {
          background: "red",
        },
      },
    },
    IconButton: {
      "&:click": {
        backgroundColor: "transparent",
      },
    },
  };

  const UserTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[1],
      fontSize: theme.typography.subtitle1.fontSize,
    },
  }));
//@alec: needs to use login from app
  useEffect(() => {
    if (!authState?.isAuthenticated) {
      oktaAuth.signInWithRedirect();
    } else {
      if(names){
        setUserName(names.join(" "));
      }
      if (initials) {
        setUserInitials(
          initials
        );
      }
    }
  }, []);

  return (
    <Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton onClick={handleClick} size="small">
          <UserTooltip title={userName} placement="top">
            <Avatar
              alt={userName}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              {userInitials}
            </Avatar>
          </UserTooltip>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 0,
            backgroundColor: theme.palette.userMenuBackground.main,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              backgroundColor: theme.palette.userMenuBackground.main,
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled style={style.MenuItem}>
          <ListItemIcon>
            <img src={User} alt="User" />
          </ListItemIcon>
          MY PROFILE
        </MenuItem>
        <MenuItem style={style.MenuItem} onClick={signOut}>
          <ListItemIcon>
            <img src={SignOut} alt="SignOut" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
