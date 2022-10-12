import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material';
export const MenuBar: React.FC = () => {
  const theme = useTheme();
  const useStyles = makeStyles(() => ({
    link: {
      textDecoration: 'none',
      color: 'black',
      fontSize: '20px',
      marginLeft: theme.spacing(20),
      '&:hover': {
        color: 'purple',
        borderBottom: '1px solid white',
      },
    },
  }));

  const classes = useStyles();
  return (
    <Typography
      sx={{
        color: '#8141f2',
        display: 'flex',
        alignItems: 'center',
        fontSize: '18px',
      }}
    >
      <Link to="/component1" className={classes.link}>
        Component1
      </Link>
      <Link to="/component2" className={classes.link}>
        Component2
      </Link>
    </Typography>
  );
};
