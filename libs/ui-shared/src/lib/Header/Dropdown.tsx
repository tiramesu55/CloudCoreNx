import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { subMenuListProps } from './NavBar';
import betaIcon from '../assets/betaIcon.png';
import { useTheme } from '@mui/material/styles';

interface Props {
  submenus: subMenuListProps[];
  dropdown: boolean;
}

const Dropdown = (props: Props) => {
  const theme = useTheme();
  const history = useHistory();
  const handleMenuItemClick = (route?: string) => {
    if (route) {
      history.push(route);
    }
  };

  return (
    <Box
      className={`dropdown browserSpecific`}
      sx={props.dropdown ? { display: 'block' } : { display: 'none' }}
    >
      {props.submenus?.map((submenu: subMenuListProps, index: number) => (
        <Box
          id={submenu.label}
          component={'button'}
          type="button"
          className={'subMenuList'}
          onClick={() => {
            handleMenuItemClick(submenu.route);
            submenu.onClick?.();
          }}
          key={index}
        >
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            {submenu.label}
            {submenu.betaIcon && (
              <Box
                component={'img'}
                src={betaIcon}
                alt="Beta version"
                sx={{
                  background: '#6513f0',
                  border: theme.palette.primary.light,
                  padding: '5px',
                  borderRadius: '5px',
                  marginLeft: theme.spacing(1.5),
                  height: 'fit-content',
                }}
              />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Dropdown;
