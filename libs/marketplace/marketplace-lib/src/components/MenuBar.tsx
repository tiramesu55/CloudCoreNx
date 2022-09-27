import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { createTheme } from '@mui/material';
const theme = createTheme();
const useStyles = makeStyles( () => ({
  link: {
    textDecoration: "none",
    color: "black",
    fontSize: "20px",
    marginLeft: theme.spacing(20),
    "&:hover": {
      color: "purple",
      borderBottom: "1px solid white",
    },
  }
}));
export const MenuBar: React.FC  = () => {
  const classes = useStyles();
  return (
     
        <Typography sx={{  color: "#8141f2", display: "flex", alignItems: "center", fontSize: "18px" }}>
        <Link to="/component1" className={classes.link}>
              Component1
        </Link>
        <Link to="/component2" className={classes.link} >
              Component2
        </Link>

        </Typography>
        
  )
}