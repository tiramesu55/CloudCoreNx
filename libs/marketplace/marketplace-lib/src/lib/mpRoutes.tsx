import { useContext, useMemo } from 'react';
import { Route } from 'react-router-dom';

import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { Header, NotAuthorized } from '@cloudcore/ui-shared';
import { useHistory, useLocation } from 'react-router-dom';
import InventorySettings from './components/inventorySettings';
import LabelSettings from './components/labelSettings';
import {Landing} from './marketplaceManagement/landing';
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
  const loc = useLocation();
  const path = useMemo(() => {
    return `${config.isMainApp ? '/marketplace/' : '/'}`;
  }, [config.isMainApp]);
  const ComponentLayout = (Component: any) => {
    //console.log(loc.pathname)
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
          

          // submenu
          {
            label: 'CONFIGURATION',
            subMenuList: [
              {
                label: 'Inventory Settings',
                route: `${path}configuration/inventory`,
              },
              { label: 'Label Setting', route: `${path}configuration/label` },
            ],
          },
          {
            label: 'Partner Reports',
            subMenuList: [
              {
                label: 'Partner 1',
                route: `${path}partner/1`,
              },
              { label: 'Partner 2', route: `${path}partner/2` },
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
    [initials, names, path, signOut]
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {mpPermissions ? (
        <>
          <Route exact path={`${path}`}>
            {ComponentLayout(PowerbiReport)}
          </Route>
          <Route path={`${path}configuration/inventory`}>
            {ComponentLayout(InventorySettings)}
          </Route>
          <Route path={`${path}configuration/label`}>
            {ComponentLayout(LabelSettings)}
          </Route>
          <Route path={`${path}partner/:id`}>
            {ComponentLayout(Landing)}
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
