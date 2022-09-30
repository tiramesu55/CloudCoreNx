/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useContext } from 'react';
import { useOktaAuth } from "@okta/okta-react";
import { Typography, Grid, Button } from "@mui/material";
import theme from "../themes";
import access_denied from "../images/access_denied.svg";
import { ConfigCtx } from "@cloudcore/okta-and-config";

export const NotAuthorized = () => {
  const { oktaAuth } = useOktaAuth();
  const { logoutSSO, postLogoutRedirectUri } = useContext(ConfigCtx)!;   // at this point config is not null (see app)

  const logout = async () => {
    //get token
    const accessTok = oktaAuth.getAccessToken() ?? "";
    const request = new Request(logoutSSO!, {
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
        postLogoutRedirectUri, //'https://ssotest.walgreens.com/idp/idpLogout',
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
