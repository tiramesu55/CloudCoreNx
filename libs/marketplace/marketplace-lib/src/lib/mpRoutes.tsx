import { useContext, useMemo } from 'react';
import { Route } from 'react-router-dom';

import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { Header, NotAuthorized } from '@cloudcore/ui-shared';
import { useHistory } from 'react-router-dom';
import Component1 from './components/component1/component1';
import Component2 from './components/component2/component2';
import Landing from './landing/landing';
import logo from './images/Nexia-Logo2.png';
import logOutIcon from './images/sign-out.svg';
import PowerbiReport from './powerbi-report/powerbi-report';

export const MpRoutes = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { signOut, initials, names, permissions } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );

  const mpPermissions =
    permissions.marketplace && permissions.marketplace?.length > 0;
  const history = useHistory();

  const path = useMemo(() => {
    return `${config.isMainApp ? '/marketplace/' : '/'}`;
  }, [config.isMainApp]);
  const ComponentLayout = (Component: any) => {
    return (
      <>
        {HeaderMerketplace}
        <Component />
      </>
    );
  };
  const HeaderMerketplace = useMemo(
    () => (
      <Header
        title={'MARKETPLACE'}
        logo={{ img: logo, path: `${path}` }}
        betaIcon={true}
        reportIssue={false}
        navLinkMenuList={[
          { label: 'Component1', route: `${path}component1` },

          // submenu
          {
            label: 'More Components',
            subMenuList: [
              {
                label: 'Component2',
                onClick: () => history.push(`${path}component2`),
              },
              { label: 'Go back', route: `${path}` },
            ],
          },
          {
            label: 'Partner Reports',
            subMenuList: [
              {
                label: 'Partner 1',
                route: `${path}/partnerReport/1`,
              },
              { label: 'Partner 2', route: `${path}/partnerReport/2` },
            ],
          },
        ]}
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
    ),
    [history, initials, names, path, signOut]
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {mpPermissions ? (
        <>
          <Route exact path={`${path}`}>
            {ComponentLayout(Landing)}
          </Route>
          <Route path={`${path}component1`}>
            {ComponentLayout(Component1)}
          </Route>
          <Route path={`${path}component2`}>
            {ComponentLayout(Component2)}
          </Route>
          <Route path={`${path}/partnerReport/:id`}>
            {ComponentLayout(PowerbiReport)}
          </Route>
        </>
      ) : (
        <Route path={path}>
          <NotAuthorized signOut={signOut} />
        </Route>
      )}
    </>
  );
};
