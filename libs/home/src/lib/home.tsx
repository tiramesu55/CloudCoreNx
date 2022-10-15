/* eslint-disable-next-line */
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { Header } from '@cloudcore/ui-shared';
import { useHistory } from 'react-router-dom';
import { theme } from '@cloudcore/ui-shared';
import {
  Paper,
  Grid,
  Typography,
  Box,
  CardContent,
  CardActionArea,
  Divider,
  Avatar,
  Card,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useContext } from 'react';
import marketplaceIcon from './images/marketplace-icon.svg';
import analyticsIcon from './images/analytics-icon.svg';
import logo from './images/Nexia-Logo2.png';
import logOutIcon from './images/sign-out.svg';

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  const config: IConfig = useContext(ConfigCtx)!;
  const { signOut, initials, names, permissions } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );

  const analyticsPermission =
    permissions?.analytics && permissions?.analytics.length > 0;
  const adminPermission = permissions?.admin && permissions?.admin.length > 0;
  const marketplacePermission =
    permissions?.marketplace && permissions?.marketplace.length > 0;
  // const ervPermission =permissions?.erv && permissions?.erv.length > 0
  const style = {
    iconTheme: {
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: '6px',
      borderColor: theme.palette.cardBorder.main,
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.cardBorder.main,
    },

    cardTheme: {
      border: 'none',
      boxShadow: 'none',
    },
  };

  const handleCardClick = (event: any) => {
    const target = event.currentTarget.dataset.id;
    const url =
      target === 'Analytics' && config.powerbiBaseUrl
        ? config.powerbiBaseUrl
        : // : target === 'ERV' && config.ervUrl
        // ? config.ervUrl
        target === 'Admin' && config.platformBaseUrl
        ? config.platformBaseUrl
        : target === 'Marketplace' && config.marketBaseUrl
        ? config.marketBaseUrl
        : '';
    if (url !== '') {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }
  };

  return (
    <div>
      <Header
        title={'HOME'}
        logo={{ img: logo, path: '/' }}
        betaIcon={true}
        reportIssue={false}
        userMenu={{
          userName: names ? names[0] : '',
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userInitials: initials!,
        }}
        userMenuList={[
          {
            icon: logOutIcon,
            label: 'Logout',
            onClick: signOut,
          },
        ]}
      />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            mt: 6,
            ml: 4,
            width: 455,
            height: 414,
            background: theme.palette.background.default,
          },
        }}
      >
        <Paper elevation={9}>
          <Box>
            <Typography
              sx={{
                padding: 2,
                fontSize: theme.typography.h2.fontSize,
                fontWeight: theme.typography.h2.fontWeight,
              }}
            >
              My NEXiA Apps
            </Typography>
            <Typography
              sx={{
                paddingBottom: 4.5,
                paddingLeft: 2,
              }}
            >
              Welcome, {names ? names[0] : ''}!
            </Typography>
          </Box>
          <Box>
            <Grid container spacing={0} bgcolor={theme.palette.secondary.main}>
              <Grid item xs={5.9} textAlign="center">
                <Box
                  style={
                    analyticsPermission
                      ? { textDecoration: 'none' }
                      : { pointerEvents: 'none', textDecoration: 'none' }
                  }
                >
                  <Card
                    data-id="Analytics"
                    onClick={handleCardClick}
                    style={style.cardTheme}
                    sx={{
                      opacity: analyticsPermission ? '1' : '0.5',
                    }}
                  >
                    <CardActionArea>
                      <Box
                        sx={{
                          paddingTop: 4,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Avatar
                          src={analyticsIcon}
                          alt="Marketplace"
                          style={style.iconTheme}
                          sx={{
                            '& .MuiAvatar-img': {
                              height: '25px',
                              width: '25px',
                            },
                          }}
                        />
                      </Box>
                      <CardContent>
                        <Typography>Analytics</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              </Grid>
              <Divider
                sx={{ bgcolor: '#F8F8F8', marginTop: 4, marginBottom: 4 }}
                orientation="vertical"
                flexItem
              />
              <Grid item xs={5.9} textAlign="center">
                <Box
                  style={
                    adminPermission
                      ? { textDecoration: 'none' }
                      : { pointerEvents: 'none', textDecoration: 'none' }
                  }
                >
                  <Card
                    data-id="Admin"
                    style={style.cardTheme}
                    sx={{
                      opacity: adminPermission ? '1' : '0.5',
                    }}
                    onClick={handleCardClick}
                  >
                    <CardActionArea>
                      <Box sx={{ paddingTop: 4 }}>
                        <PersonIcon fontSize="large" style={style.iconTheme} />
                      </Box>
                      <CardContent>
                        <Typography>Platform Management</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              </Grid>

              <Grid item xs={5.9} textAlign="center">
                <Box
                  style={
                    marketplacePermission
                      ? { textDecoration: 'none' }
                      : { pointerEvents: 'none', textDecoration: 'none' }
                  }
                >
                  <Card
                    data-id="Marketplace"
                    onClick={handleCardClick}
                    style={style.cardTheme}
                    sx={{
                      opacity: marketplacePermission ? '1' : '0.5',
                    }}
                  >
                    <CardActionArea>
                      <Box
                        sx={{
                          paddingTop: 4,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Avatar
                          src={marketplaceIcon}
                          alt="Marketplace"
                          style={style.iconTheme}
                          sx={{
                            '& .MuiAvatar-img': {
                              height: '25px',
                              width: '25px',
                            },
                          }}
                        />
                      </Box>
                      <CardContent>
                        <Typography>Marketplace</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              </Grid>

              {/* <Divider
                sx={{ bgcolor: '#F8F8F8', marginTop: 4, marginBottom: 4 }}
                orientation="vertical"
                flexItem
              /> */}
              {/* <Grid item xs={5.9} textAlign="center">
                <Box
                  style={
                    ervPermission
                      ? { textDecoration: 'none' }
                      : { pointerEvents: 'none', textDecoration: 'none' }
                  }
                >
                  <Card
                    data-id="ERV"
                    onClick={handleCardClick}
                    style={style.cardTheme}
                    sx={{
                      opacity: ervPermission ? '1' : '0.5',
                    }}
                  >
                    <CardActionArea>
                      <Box sx={{ paddingTop: 4 }}>
                        <AppsRoundedIcon
                          fontSize="large"
                          style={style.iconTheme}
                        />
                      </Box>
                      <CardContent>
                        <Typography>ERV</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              </Grid> */}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Home;
