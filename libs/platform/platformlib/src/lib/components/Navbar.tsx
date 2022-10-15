import {
  AppBar,
  Box,
  useMediaQuery,
  CssBaseline,
  Container,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { ResponsiveToolBar } from './ResponsiveToolbar';

export const NavBar = () => {
  const theme = useTheme();
  const style = {
    appBar: {
      border: '1px',
      borderColor: theme.palette.navbarBorder.main,
      borderBottom: `1px solid ${theme.palette.navbarBorder.main}`,
      margin: '0px',
      boxShadow: '0px 3px 6px #0000000D',
      background: theme.palette.secondary.main,
      zIndex: theme.zIndex.drawer + 1,
    },
  };
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <Box sx={{ m: 0 }}>
      <CssBaseline />
      <AppBar style={style.appBar} position="relative">
        {isLargeDevice ? (
          <Container
            maxWidth={false}
            sx={{
              margin: 0,
              padding: 0,
              [theme.breakpoints.up('sm')]: {
                paddingLeft: 0,
                paddingRight: 0,
              },
            }}
          >
            <ResponsiveToolBar />
          </Container>
        ) : (
          <Container
            maxWidth="xl"
            sx={{
              margin: 0,
              padding: 0,
            }}
          >
            <ResponsiveToolBar />
          </Container>
        )}
      </AppBar>
    </Box>
  );
};
