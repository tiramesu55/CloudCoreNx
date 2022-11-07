import MenuItems from './MenuItems';
import { Box } from '@mui/material';

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
}

const Navbar = (props: navigationPropsArray) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {props.navigationPropsArray?.map(
        (menu: navigationProps, index: number) => {
          return <MenuItems navigationProps={menu} key={index} />;
        }
      )}
    </Box>
  );
};

export default Navbar;
