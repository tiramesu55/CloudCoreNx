import { Typography, Grid, Button } from '@mui/material';
import theme from './themes';

import React from 'react';
import access_denied from './assets/access_denied.svg';

import React from "react";
//import access_denied from "../assets/access_denied.svg";
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
type Props = {
  signOut: () => void;
};
export const NotAuthorized: React.FC<Props> = (props) => {
  //const classes = useStyles();

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent={'center'}
        sx={{ marginTop: theme.spacing(3) }}
      >
        {/* <img height={"240px"} src={access_denied} alt="access_denied" /> */}
        {/* <BlockIcon
          sx={{ fontSize: "100px", color: theme.palette.error.main }}
        /> */}
      </Grid>
      <Grid item xs={12} display="flex" justifyContent={'center'}>
        <Typography fontSize="theme.typography.h3.fontSize">
          Access Denied
        </Typography>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent={'center'}>
        <Typography fontSize="theme.typography.subtitle1.fontSize">
          It Seems like you don't have permission to use this portal.
        </Typography>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent={'center'}>
        <Typography fontSize="theme.typography.subtitle1.fontSize">
          Please sign in with a different account.
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent={'center'}
        sx={{ marginTop: 5 }}
      >
        <Button variant="contained" onClick={props.signOut}>
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};
