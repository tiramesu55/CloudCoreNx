/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useMemo, useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';
import {
  mainStore,
  reportsActions,
  openAlertAction,
  closeAlertAction,
  getMaintenanceAsync,
  bypassUserAsync,
} from '@cloudcore/redux-store';
import { ConfigCtx, IConfig, UseClaimsAndSignout, useClaimsAndSignout } from '@cloudcore/okta-and-config';
import LabelSettings from './components/labelSettings';
import {
  Header,
  NotAuthorized,
  nexia_logo_img,
  sign_out_img,
  DisplayMaintenance
} from '@cloudcore/ui-shared';

import { IAlert, useMaintenance } from '@cloudcore/common-lib';
import ConfigurationTabs from './components/Configuration/Tabs/ConfigurationTabs';
import LandingPage from './pages/LandingPage';
import { useTheme } from '@mui/material';

export const MpRoutes = () => {

  const theme = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { isMainApp, marketplaceReports, platformBaseUrl } = useContext(ConfigCtx) as IConfig; // at this point config is not null (see app)
  const { signOut, initials, names, permissions, email, token } = useClaimsAndSignout() as UseClaimsAndSignout;

  const mpp = permissions.get('marketplace');
  const mpPermissions = mpp && mpp.length > 0;
  const path = useMemo(() => {
    return `${isMainApp ? '/marketplace/' : '/'}`;
  }, [isMainApp]);
  const { useAppDispatch, useAppSelector } = mainStore;
  const config: IConfig = useContext(ConfigCtx)!;
  const currentDate = new Date();
  const {
    displayMaintenance, underMaintenance, maintenanceStartDate, maintenanceEndDate,
    maintenanceReason, fullLockout, handleDisplayMaintenanceDialog, isBypassUser, loadData
  } = useMaintenance("Marketplace", currentDate);

  const dispatch = useAppDispatch();
  const { loadingReportSingle, selectFilterItemSelected, selectReport } =
    reportsActions;

  useEffect(() => {
    if (platformBaseUrl) {
      dispatch(getMaintenanceAsync(
        {
          url: platformBaseUrl,
          token: token,
        }
      ))
      dispatch(
        bypassUserAsync({
          url: platformBaseUrl,
          token: token,
          email: email,
        })
      )
    }
  }, [platformBaseUrl])

  const ComponentLayout = (Component: any, isReport?: boolean) => {
    const { loadingSingleReport, reportFilter, selectedReports } =
      useAppSelector((state) => state.report);
    const { openAlert, type, content } = useAppSelector(
      (state) => state.common
    );
    // useEffect(() => {
    //   if (isReport && !selectedReportMarketplaceId) {
    //     dispatch(selectReportMarketplace(marketplaceReports[0]));
    //   }
    // }, [isReport]);
    const handleOpenAlert = (payload: IAlert) =>
      dispatch(openAlertAction(payload));
    const handleCloseAlert = () => dispatch(closeAlertAction());

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
            selectedReportId={selectedReports['selectedReportMarketplaceId']}
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
              content,
            }}
          />
        );
      } else {
        return (
          <Component
            handleOpenAlert={handleOpenAlert}
            handleCloseAlert={handleCloseAlert}
            alertData={{
              openAlert,
              type,
              content,
            }}
          />
        );
      }
    }, [
      isReport,
      selectedReports['selectedReportMarketplaceId'],
      reportFilter,
      loadingSingleReport,
      email,
      names,
      openAlert,
      loadData
    ]);
    return (
      <>
        {HeaderMerketplace}
        {loadData && ComponentToRender}
      </>
    );
  };
  const HeaderMerketplace = useMemo(
    () => (
      <>
        <DisplayMaintenance
          open={displayMaintenance}
          underMaintenance={underMaintenance}
          handleDisplayMaintenanceDialog={handleDisplayMaintenanceDialog}
          maintenanceStartDate={
            maintenanceStartDate
          }
          maintenanceEndDate={maintenanceEndDate}
          maintenanceReason={maintenanceReason}
          fullLockout={fullLockout}
          bypassUser={isBypassUser}
          mainApp={config.isMainApp}
          logout={() => signOut()}
        />
        <Header
          title={'Marketplace'}
          logo={{ img: nexia_logo_img, path: `${path}` }}
          betaIcon={true}
          reportIssue={false}
          marketplaceConfiguration={
            <NavLink
              to="/marketplace/configuration/inventory"
              exact
              style={{
                textDecoration: 'none',
                color: theme.palette.primary.main,
                fontSize: theme.typography.subtitle1.fontSize,
                marginRight: theme.spacing(3),
                fontFamily: theme.typography.fontFamily,
                marginTop: "auto",
                marginBottom: "auto"
              }}
            >
              Configuration
            </NavLink>
          }
          userMenu={{
            userName: names ? names[0] + ' ' + names[1] : '',
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            userInitials: initials!,
          }}
          userMenuList={
            [
              {
                icon: sign_out_img,
                label: 'Logout',
                onClick: signOut,
              },
            ]}
        />
      </>
    ),
    [initials, names, path, signOut, displayMaintenance]
  );
  useEffect(() => {
    // dispatch(
    //   selectReport({
    //     key: 'selectedReportMarketplaceId',
    //     value: marketplaceReports[0],
    //   })
    // );
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {mpPermissions ? (
        <>
          <Route exact path={`${path}`}>
            {ComponentLayout(LandingPage)}
          </Route>
          <Route path={`${path}configuration/inventory`}>
            {ComponentLayout(ConfigurationTabs)}
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
