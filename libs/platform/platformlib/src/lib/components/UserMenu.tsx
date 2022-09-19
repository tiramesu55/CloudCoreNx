import { useState, Fragment, useEffect } from "react";
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
import { useAppSelector } from "../hooks/hooks";
import { logoutSSO, postLogoutRedirectUri } from '@cloudcore/redux-store';

export const UserMenu = () => {
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const { oktaAuth, authState } = useOktaAuth();
  const postLogoutUrl: string | undefined = useAppSelector(
    postLogoutRedirectUri
  );
  const ssoUrl = useAppSelector(logoutSSO);
  const logout = async () => {
    //get token
    const accessTok = oktaAuth.getAccessToken() ?? "";
    const request = new Request(ssoUrl!, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessTok}`,
      },
      method: "GET",
    });
    try {
      const response = await fetch(request);

      if (!response.ok) {
        console.log(`HTTP error in closing Session: ${response.status}`);
      }
      console.log("session closed");
    } finally {
      await oktaAuth.signOut({
        postLogoutRedirectUri: postLogoutUrl, //'https://ssotest.walgreens.com/idp/idpLogout',
        clearTokensBeforeRedirect: true,
      });
    }
  };
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

  useEffect(() => {
    if (!authState?.isAuthenticated) {
      oktaAuth.signInWithRedirect();
    } else {
      const claims = authState.accessToken?.claims as any;
      if (claims?.initials) {
        setUserName(claims?.initials.join(" "));
        setUserInitials(
          claims?.initials.map((name: string) => name[0].toUpperCase()).join("")
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
        <MenuItem style={style.MenuItem} onClick={logout}>
          <ListItemIcon>
            <img src={SignOut} alt="SignOut" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
