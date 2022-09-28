import { Typography, Grid, Button } from "@mui/material";
import React from "react";
import access_denied from "./assets/access_denied.svg";

type Props = {
  signOut: () => void
};

export const NotAuthorized: React.FC<Props> = (props) => {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent={"center"}
        sx={{ marginTop: 3 }}
      >
        <img height={"240px"} src={access_denied} alt="access_denied" />
        {/* <BlockIcon
          sx={{ fontSize: "100px", color: theme.palette.error.main }}
        /> */}
      </Grid>
      <Grid item xs={12} display="flex" justifyContent={"center"}>
        <Typography fontSize="24px">Access Denied</Typography>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent={"center"}>
        <Typography fontSize="18px">
          It Seems like you don't have permission to use this portal.
        </Typography>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent={"center"}>
        <Typography fontSize="18px">
          Please sign in with a different account.
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent={"center"}
        sx={{ marginTop: 5 }}
      >
        <Button variant="contained" onClick={props.signOut}>
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

