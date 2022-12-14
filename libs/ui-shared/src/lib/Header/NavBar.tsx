import MenuItems from './MenuItems';
import { Box } from '@mui/material';
import { withStyles } from '@mui/styles';

interface navigationPropsArray {
  navigationPropsArray: navigationProps[];
}

export interface navigationProps {
  label: string;
  route?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  subMenuList?: subMenuListProps[];
}

export interface subMenuListProps {
  label: string;
  onClick?: () => void;
  route?: string;
  betaIcon?: boolean;
}

const CustomSelectCss = withStyles((theme) => ({
  '@global': {
    '.subMenuList': {
      backgroundColor: 'transparent',
      border: '0px',
      cursor: 'pointer',
      verticalAlign: 'middle',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      textDecoration: 'none',
      minHeight: '48px',
      padding: '6px 16px',
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: '#E6E8F3',
      },
      width: '100%',
      fontSize: theme.typography.body1.fontSize,
    },
    '.dropdown': {
      position: 'absolute',
      right: '0',
      left: 'auto',
      zIndex: '9999',
      minWidth: '-webkit-fill-available',
      width: 'max-content',
      padding: '0',
      backgroundColor: '#fff',
      borderBottomLeftRadius: '0.5rem',
      borderBottomRightRadius: '0.5rem',
      top: '100%',
      boxShadow: '0px 2px 5px #333',
      border: '0px solid grey',
    },
    '.browserSpecific': {
      minWidth: '-moz-available',
    },
  },
}))(() => null);

const Navbar = (props: navigationPropsArray) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CustomSelectCss />
      {props.navigationPropsArray?.map(
        (menu: navigationProps, index: number) => {
          return <MenuItems navigationProps={menu} key={index} />;
        }
      )}
    </Box>
  );
};

export default Navbar;
