import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { subMenuListProps } from './NavBar';
import { Theme } from '@mui/material/styles';

interface Props {
  submenus: subMenuListProps[];
  dropdown: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  subMenuList: {
    padding: theme.spacing(1),
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: '#E6E8F3',
    },
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    right: '0',
    left: 'auto',
    zIndex: '9999',
    minWidth: '-webkit-fill-available',
    width: 'max-content',
    padding: '0',
    backgroundColor: '#fff',
    borderRadius: '0.5rem',
    top: '100%',
    boxShadow: '0px 2px 5px #333',
    border: '0px solid grey',
  },
}));

const Dropdown = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const handleMenuItemClick = (route?: string) => {
    if (route) {
      history.push(route);
    }
  };

  return (
    <Box
      className={classes.dropdown}
      sx={props.dropdown ? { display: 'block' } : { display: 'none' }}
    >
      {props.submenus?.map((submenu: subMenuListProps, index: number) => (
        <Box
          component={'button'}
          type="button"
          className={classes.subMenuList}
          onClick={() => {
            handleMenuItemClick(submenu.route);
            submenu.onClick?.();
          }}
          key={index}
        >
          {submenu.label}
        </Box>
      ))}
    </Box>
  );
};

export default Dropdown;
