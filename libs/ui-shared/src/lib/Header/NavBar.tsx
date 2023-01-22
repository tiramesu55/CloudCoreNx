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
        backgroundColor: theme.palette.menuHoverColor.main,
        '&:last-child': {
          '-webkit-border-bottom-left-radius': theme.spacing(1),
          '-moz-border-bottom-left-radius': theme.spacing(1),
          '-webkit-border-bottom-right-radius': theme.spacing(1),
          '-moz-border-bottom-right-radius': theme.spacing(1),
        },
        '& .defaultApp': {
          visibility: 'visible',
        },
      },
      '&:hover:': {
        backgroundColor: theme.palette.menuHoverColor.main,
        display: 'block',
        defaultApp: {
          display: 'block !important',
        },
      },
      width: '100%',
      fontSize: theme.typography.body1.fontSize,
    },
    '.defaultApp': {
      visibility: 'hidden',
    },
    '.dropdown': {
      position: 'absolute',
      right: '0',
      left: 'auto',
      zIndex: '9999',
      minWidth: '-webkit-fill-available',
      width: 'max-content',
      padding: '0',
      backgroundColor: theme.palette.secondary.main,
      borderBottomLeftRadius: theme.spacing(1),
      borderBottomRightRadius: theme.spacing(1),
      top: '100%',
      boxShadow:
        'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
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
