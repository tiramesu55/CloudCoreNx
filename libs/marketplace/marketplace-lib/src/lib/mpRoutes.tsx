/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useMemo, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { mainStore, reportsActions } from '@cloudcore/redux-store';
import { ConfigCtx, useClaimsAndSignout } from '@cloudcore/okta-and-config';
import { Header, NotAuthorized } from '@cloudcore/ui-shared';
import InventorySettings from './components/inventorySettings';
import LabelSettings from './components/labelSettings';
import nexia_logo_img from '../../../../ui-shared/src/lib/assets/NexiaLogo.svg';
import sign_out_img from '../../../../ui-shared/src/lib/assets/sign-out.svg';
import PowerbiReport from './powerbi-report/powerbi-report';

export const MpRoutes = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { logoutSSO, postLogoutRedirectUri, isMainApp, marketplaceReports } =
    useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { signOut, initials, names, permissions, email } = useClaimsAndSignout(
    logoutSSO,
    postLogoutRedirectUri
  );

  const mpPermissions =
    permissions.marketplace && permissions.marketplace?.length > 0;
  const path = useMemo(() => {
    return `${isMainApp ? '/marketplace/' : '/'}`;
  }, [isMainApp]);
  const { useAppDispatch, useAppSelector } = mainStore;

  const dispatch = useAppDispatch();
  const {
    openAlert,
    loadingReportSingle,
    selectFilterItemSelected,
    selectReportMarketplace,
  } = reportsActions;

  const ComponentLayout = (Component: any, isReport?: boolean) => {
    const { loadingSingleReport, reportFilter, selectedReportMarketplaceId } =  useAppSelector((state) => state.report);
    // useEffect(() => {
    //   if (isReport && !selectedReportMarketplaceId) {
    //     dispatch(selectReportMarketplace(marketplaceReports[0]));
    //   }
    // }, [isReport]);
    const handleOpenAlert = (message: string, status: number) =>
      dispatch(openAlert(message, status));

    const handleLoadingReportSingle = (data: boolean) =>
      dispatch(loadingReportSingle(data));

    const handleSelectFilterItemSelected = (
      filter: string[],
      operator: string
    ) => dispatch(selectFilterItemSelected(filter, operator));

    const ComponentToRender = useMemo(() => {
      if (isReport) {
        return (
          <Component
            selectedReportId={selectedReportMarketplaceId}
            handleOpenAlert={handleOpenAlert}
            handleLoadingReportSingle={handleLoadingReportSingle}
            handleSelectFilterItemSelected={handleSelectFilterItemSelected}
            reportFilter={reportFilter}
            loadingSingleReport={loadingSingleReport}
            userName={names ? names[0] : ''}
            userEmail={email ?? ''}
          />
        );
      } else {
        return <Component />;
      }
    }, [
      isReport,
      selectedReportMarketplaceId,
      reportFilter,
      loadingSingleReport,
      email,
      names,
    ]);
    return (
      <>
        {HeaderMerketplace}
        {ComponentToRender}
      </>
    );
  };
  const HeaderMerketplace = useMemo(
    () => (
      <Header
        title={'MARKETPLACE'}
        logo={{ img: nexia_logo_img, path: `${path}` }}
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
                route: path,
                onClick: () => dispatch(selectReportMarketplace(marketplaceReports[1])),
              },
              {
                label: 'Partner 2',
                route: path,
                onClick: () => dispatch(selectReportMarketplace(marketplaceReports[2])),
              },
            ],
          },
        ]}
        userMenu={{
          userName: names ? names[0] + ' ' + names[1] : '',
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userInitials: initials!,
        }}
        userMenuList={[
          {
            icon: sign_out_img,
            label: 'Logout',
            onClick: signOut,
          },
        ]}
      />
    ),
    [initials, names, path, signOut]
  );
   useEffect(() => {
       dispatch(selectReportMarketplace(marketplaceReports[0]));
 }, []);
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {mpPermissions ? (
        <>
          <Route exact path={`${path}`}>
            {ComponentLayout(PowerbiReport, true)}
          </Route>
          <Route path={`${path}configuration/inventory`}>
            {ComponentLayout(InventorySettings)}
          </Route>
          <Route path={`${path}configuration/label`}>
            {ComponentLayout(LabelSettings)}
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
