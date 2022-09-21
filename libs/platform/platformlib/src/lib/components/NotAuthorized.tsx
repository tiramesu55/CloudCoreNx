import { useOktaAuth } from "@okta/okta-react";
import { makeStyles } from "@mui/styles";
import { Typography, Grid, Button } from "@mui/material";
import { useAppSelector } from "../hooks/hooks";
import theme from "../themes";
import access_denied from "../images/access_denied.svg";
import { logoutSSO, postLogoutRedirectUri } from '@cloudcore/redux-store';

const useStyles = makeStyles({
  root: {
    //minWidth: "100%",
    minHeight: "80vh",
    //display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  card: {
    maxWidth: "40%",
    minHeight: "20vh",
    display: "flex",
    alignItems: "center",
  },
});

export const NotAuthorized = () => {
  const { oktaAuth } = useOktaAuth();
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
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent={"center"}
        sx={{ marginTop: theme.spacing(3) }}
      >
        <img height={"240px"} src={access_denied} alt="access_denied" />
        {/* <BlockIcon
          sx={{ fontSize: "100px", color: theme.palette.error.main }}
        /> */}
      </Grid>
      <Grid item xs={12} display="flex" justifyContent={"center"}>
        <Typography fontSize={theme.typography.h3.fontSize}>
          Access Denied
        </Typography>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent={"center"}>
        <Typography fontSize={theme.typography.subtitle1.fontSize}>
          It Seems like you don't have permission to use this portal.
        </Typography>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent={"center"}>
        <Typography fontSize={theme.typography.subtitle1.fontSize}>
          Please sign in with a different account.
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent={"center"}
        sx={{ marginTop: theme.spacing(5) }}
      >
        <Button variant="contained" onClick={logout}>
          Logout
        </Button>
      </Grid>
    </Grid>
  );
}