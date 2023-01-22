/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useContext, useEffect, useState } from 'react';
import { ConfigCtx, IConfig, OktaCode } from '@cloudcore/okta-and-config';
import { ThemeProvider } from '@mui/material/styles';
import { Snackbar, theme } from '@cloudcore/ui-shared';
import { AnalyticsPowerbi } from '@cloudcore/analytics/powerbi';
import { MpRoutes } from '@cloudcore/marketplace/marketplace-lib';
import { Route, Redirect } from 'react-router-dom';
import { Routes } from '@cloudcore/platform/platformlib';
import {
  closeAlertAction,
  getUserConfig,
  mainStore,
  openAlertAction,
  upsertUserConfig,
} from '@cloudcore/redux-store';
import { IAlert, IAppData, IAppsMenu } from '@cloudcore/common-lib';
import {
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
const { useAppDispatch } = mainStore;

type defaultAppStatus = 'error' | 'success';

const App = () => {
  const config: IConfig | null = useContext(ConfigCtx);
  const dispatch = useAppDispatch();

  const MainRoute = () => {
    const { token, permissions } = useClaimsAndSignout() as UseClaimsAndSignout;
    const [defaultApp, setDefaultApp] = useState<null | string>('');
    const [userSetDefaultApp, setUserSetDefaultApp] = useState('');
    const [defaultAppRoute, setDefaultAppRoute] = useState<null | string>('');
    const [defaultAppStatus, setDefaultAppStatus] =
      useState<defaultAppStatus>('success');
    const handleOpenAlert = (payload: IAlert) =>
      dispatch(openAlertAction(payload));
    const appcodes = {
      enterpriseAnalytics: 'analytics',
      marketplace: 'marketplace',
      platformManagement: 'admin',
    };

    const apps: IAppData[] = [
      {
        name: 'Enterprise Analytics',
        url: config?.isMainApp ? '/analytics' : '/',
        permission: (permissions.get('analytics') ?? []).length > 0,
        appCode: appcodes.enterpriseAnalytics,
        defaultApp: userSetDefaultApp === appcodes.enterpriseAnalytics,
        markAsDefaultApp: () => {
          markAsDefaultApp(appcodes.enterpriseAnalytics);
        },
      },
      {
        name: 'Marketplace',
        url: config?.isMainApp ? '/marketplace/' : '/',
        permission: (permissions.get('marketplace') ?? []).length > 0,
        appCode: appcodes.marketplace,
        defaultApp: userSetDefaultApp === appcodes.marketplace,
        markAsDefaultApp: () => {
          markAsDefaultApp(appcodes.marketplace);
        },
      },
      {
        name: 'Platform Management',
        url: config?.isMainApp ? '/platform' : '/',
        permission: (permissions.get('admin') ?? []).length > 0,
        appCode: appcodes.platformManagement,
        defaultApp: userSetDefaultApp === appcodes.platformManagement,
        markAsDefaultApp: () => {
          markAsDefaultApp(appcodes.platformManagement);
        },
      },
    ].filter((app) => app.permission);

    const appsMenu: IAppsMenu = {
      appsData: apps,
      defaultAppStatus: defaultAppStatus,
    };

    const markAsDefaultApp = (appCode: string) => {
      setDefaultAppStatus('success');
      dispatch(
        upsertUserConfig({
          url: config?.platformBaseUrl,
          token: token,
          data: { userSetDefaultApp: appCode },
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            dispatch(
              getUserConfig({ url: config?.platformBaseUrl, token: token })
            )
              .unwrap()
              .then(
                (value: any) => {
                  setUserSetDefaultApp(value.data.userSetDefaultApp);
                  setDefaultApp(value.data.defaultApp);
                  const appData = apps.find((app) => {
                    return app.appCode === value.data.userSetDefaultApp;
                  });
                  handleOpenAlert({
                    content: `You just selected ${appData?.name} as your default application!`,
                    type: 'success',
                  });
                },
                (reason: any) => {
                  handleOpenAlert({
                    content: reason.message,
                    type: 'error',
                  });
                }
              );
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
            setDefaultAppStatus('error');
          }
        );
    };

    useEffect(() => {
      dispatch(getUserConfig({ url: config?.platformBaseUrl, token: token }))
        .unwrap()
        .then(
          (res: any) => {
            setUserSetDefaultApp(res.data.userSetDefaultApp);
            setDefaultApp(res.data.defaultApp);
            const defaultAppRoute =
              defaultApp === appcodes.platformManagement
                ? '/platform'
                : defaultApp === appcodes.enterpriseAnalytics
                ? '/analytics'
                : defaultApp === appcodes.marketplace
                ? '/marketplace'
                : '';
            setDefaultAppRoute(defaultAppRoute);
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    }, [apps, defaultApp, token, userSetDefaultApp]);

    return (
      <>
        <Route exact path="/">
          <Redirect to={defaultAppRoute} />
        </Route>
        <AnalyticsPowerbi appsMenu={appsMenu} />
        <MpRoutes appsMenu={appsMenu} />
        <Routes appsMenu={appsMenu} />
      </>
    );
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {config && (
        <ThemeProvider theme={theme}>
          <OktaCode
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            oidc={config.oidcConfig!}
            router={MainRoute}
          />
        </ThemeProvider>
      )}
    </>
  );
};

export default App;
