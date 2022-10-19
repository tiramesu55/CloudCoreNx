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
import {AnalyticsPowerbi} from '@cloudcore/analytics/powerbi'
import PersonIcon from '@mui/icons-material/Person';
import { useContext } from 'react';
import marketplaceIcon from './images/marketplace-icon.svg';
import analyticsIcon from './images/analytics-icon.svg';
import logo from './images/Nexia-Logo2.png';
import logOutIcon from './images/sign-out.svg';

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig = useContext(ConfigCtx)!;
  const { signOut, initials, names, permissions } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  console.log('config',config)
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
      // const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      // if (newWindow) newWindow.opener = null;
      history.push()
    }
  };

  return (
   <AnalyticsPowerbi />
  );
}

export default Home;
