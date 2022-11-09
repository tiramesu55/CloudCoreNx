/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useMemo, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { mainStore, reportsActions, openAlertAction, closeAlertAction } from '@cloudcore/redux-store';
import { ConfigCtx, useClaimsAndSignout } from '@cloudcore/okta-and-config';
import { Header, NotAuthorized } from '@cloudcore/ui-shared';
import InventorySettings from './components/inventorySettings';
import LabelSettings from './components/labelSettings';
import nexia_logo_img from '../../../../ui-shared/src/lib/assets/NexiaLogo.svg';
import sign_out_img from '../../../../ui-shared/src/lib/assets/sign-out.svg';
import PowerbiReport from './powerbi-report/powerbi-report';
import { IAlert } from '@cloudcore/common-lib';

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
    loadingReportSingle,
    selectFilterItemSelected,
    selectReport,
  } = reportsActions;

  const ComponentLayout = (Component: any, isReport?: boolean) => {
    const { loadingSingleReport, reportFilter, selectedReports } =  useAppSelector((state) => state.report);
    const { openAlert, type, content } =  useAppSelector((state) => state.common);
    // useEffect(() => {
    //   if (isReport && !selectedReportMarketplaceId) {
    //     dispatch(selectReportMarketplace(marketplaceReports[0]));
    //   }
    // }, [isReport]);
    const handleOpenAlert = (payload: IAlert) =>
      dispatch(openAlertAction(payload));
      const handleCloseAlert = () =>
      dispatch(closeAlertAction());

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
            selectedReportId={selectedReports["selectedReportMarketplaceId"]}
            handleOpenAlert={handleOpenAlert}
            handleLoadingReportSingle={handleLoadingReportSingle}
            handleSelectFilterItemSelected={handleSelectFilterItemSelected}
            reportFilter={reportFilter}
            loadingSingleReport={loadingSingleReport}
            userName={names ? names[0] : ''}
            userEmail={email ?? ''}
            handleCloseAlert={handleCloseAlert}
            alertData={{
              openAlert, 
              type, 
              content
            }}
          />
        );
      } else {
        return <Component />;
      }
    }, [
      isReport,
      selectedReports["selectedReportMarketplaceId"],
      reportFilter,
      loadingSingleReport,
      email,
      names,
      openAlert
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
                onClick: () => dispatch(selectReport({
                  key: 'selectedReportMarketplaceId',
                  value: marketplaceReports[1]
                })),
              },
              {
                label: 'Partner 2',
                route: path,
                onClick: () => dispatch(selectReport({
                  key: 'selectedReportMarketplaceId',
                  value: marketplaceReports[2]
                })),
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
       dispatch(selectReport({
        key: 'selectedReportMarketplaceId',
        value: marketplaceReports[0]
      }));
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
