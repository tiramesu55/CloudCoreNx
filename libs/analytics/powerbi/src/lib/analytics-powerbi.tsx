/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy
} from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import {
  Backdrop as BackdropPowerBi,
  Header,
  NotAuthorized,
  IdlePopUp,
  nexia_logo_img,
  sign_out_img,
  DisplayMaintenance,
  Snackbar,
} from '@cloudcore/ui-shared';

import {
  useAppInsightHook,
  IErrorTypeResponse,
  requests,
  IAlert,
  useMaintenance,
  IAppsMenu,
} from '@cloudcore/common-lib';
import {
  analyticsStore,
  reportsActions,
  openAlertAction,
  closeAlertAction,
  getMaintenanceAsync,
  bypassUserAsync,
} from '@cloudcore/redux-store';
import { Route } from 'react-router-dom';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { Button, Grid, Typography, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/* eslint-disable-next-line */
interface Props {
  appsMenu?: IAppsMenu;
}
const ReportBiClientComponent = lazy(() => import('@cloudcore/powerbi'));
export const AnalyticsPowerbi = (props: Props) => {
  const theme = useTheme();
  const { useAppDispatch, useAppSelector } = analyticsStore;
  const dispatch = useAppDispatch();

  // const [listReportLoading, setListReportLoading] = useState<boolean>(false);
  const [defaultReport, setDefaultReport] = useState<string>('');
  const [activityModal, setActivityModal] = useState<boolean>(false);
  const config: IConfig = useContext(ConfigCtx) as IConfig;
  const {
    loadReports,
    loadingReportSingle,
    selectFilterItemSelected,
    selectReport,
  } = reportsActions;

  const currentDate = new Date();

  const {
    displayMaintenance,
    underMaintenance,
    maintenanceStartDate,
    maintenanceEndDate,
    maintenanceReason,
    fullLockout,
    handleDisplayMaintenanceDialog,
    isBypassUser,
    loadData,
  } = useMaintenance('Analytics', currentDate);

  const { signOut, token, initials, names, permissions, email } =
    useClaimsAndSignout()!;

  const handleOpenAlert = (payload: IAlert) =>
    dispatch(openAlertAction(payload));
  const handleCloseAlert = () => dispatch(closeAlertAction());

  const handleLoadingReportSingle = (data: boolean) =>
    dispatch(loadingReportSingle(data));
  const handleSelectFilterItemSelected = (filter: string[], operator: string) =>
    dispatch(selectFilterItemSelected(filter, operator));

  const { loadingSingleReport, selectedReports, reportFilter, reports } =
    useAppSelector((state) => state.report);
  const { openAlert, content, type } = useAppSelector((state) => state.common);
  const selectedReportName = useMemo(() => {
    const selectedRoport = reports?.filter(
      (report) =>
        report.reports &&
        report.reports.find(
          (item) => item.reportId === selectedReports['selectedReportId']
        )
    );
    if (selectedRoport?.length === 1) {
      const report = selectedRoport[0].reports.find(
        (report) => report.reportId === selectedReports['selectedReportId']
      );
      return report?.reportName ? report?.reportName : '';
    }
    return '';
  }, [reports, selectedReports['selectedReportId']]);

  const { HandleReportEvent } = useAppInsightHook();
  const ap = permissions.get('analytics');
  const anltPermissions = ap && ap.length > 0;
  const handleErrorResponse = (err: IErrorTypeResponse) => {
    HandleReportEvent({
      properties: {
        userName: names ? names[0] + ' ' + names[1] : '',
        emailId: email,
        message: err?.message,
      },
      type: err?.type ? err.type : 'ErrorType',
    });
    handleOpenAlert({
      content: err?.messageToShow ? err.messageToShow : 'Error response',
      type: 'error',
    });
  };
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  useEffect(() => {
    const getDefaultReport = async () => {
      try {
        //todo get default report from API and setDefaultReport state
        const resp = await requests.get(
          config.platformBaseUrl + '/UserConfiguration' || '',
          {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
          //todo: need to set type for the return
        );
        const reportId = resp.lastOpenedReportId;
        setDefaultReport(reportId);
      } catch (err) {
        //we do not care it it is succesful or not, but want to see the error
        console.log('cannot put default report');
      }
    };
    if (token) {
      if (config?.platformBaseUrl) {
        // setListReportLoading(true);  //  too quick. No point running spinner
        requests
          .get(config?.platformBaseUrl + '/GetSuitesByPermission', {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          })
          .then((response) => {
            //   setListReportLoading(false);
            dispatch(loadReports(response.suites));
          })
          .catch((error) => {
            //  setListReportLoading(false);
            handleErrorResponse({
              type: 'GetGroupReports',
              message: error.message,
              status: error.status ? error.status : 401,
              messageToShow: error.message,
            });
          });
      }
    }
  }, []);

  useEffect(() => {
    if (platformBaseUrl) {
      dispatch(
        getMaintenanceAsync({
          url: platformBaseUrl,
          token: token,
        })
      );
      dispatch(
        bypassUserAsync({
          url: platformBaseUrl,
          token: token,
          email: email,
        })
      );
    }
  }, [platformBaseUrl, token, dispatch]);

  const handleReportClick = async (reportId: string, reportName: string) => {
    dispatch(
      selectReport({
        key: 'selectedReportId',
        value: reportId,
      })
    );
    try {
      await requests.put(
        config.platformBaseUrl + '/UserConfiguration' || '',
        {
          lastOpenedReportId: reportId,
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );
    } catch (err) {
      //we do not care it it is succesful or not, but want to see the error
      console.log('cannot put default report');
    }

    HandleReportEvent({
      properties: {
        userName: names ? names[0] + ' ' + names[1] : '',
        emailId: email,
        reportId: reportId,
        reportName: reportName,
      },
      type: 'Open Report',
    });
  };

  useEffect(() => {
    openDefaultReport();
  }, [reports, defaultReport]);

  const openDefaultReport = useCallback(() => {
    if (!reports) return;
    if (defaultReport) {
      dispatch(
        selectReport({
          key: 'selectedReportId',
          value: defaultReport,
        })
      );
    } else if (config.DEFAULT_REPORTID) {
      dispatch(
        selectReport({
          key: 'selectedReportId',
          value: config.DEFAULT_REPORTID,
        })
      );
    }
  }, [reports, defaultReport]);

  const navLinkMenuList = useMemo(() => {
    return reports //&& loadData === true
      ? reports?.map((item) => ({
          label: item.name,
          subMenuList:
            item.reports &&
            item.reports.map((report) => ({
              label: report.reportName,
              onClick: () =>
                handleReportClick(report.reportId, report.reportName),
              betaIcon: report.beta,
            })),
        }))
      : [];
  }, [reports, loadData]);

  const path = useMemo(() => {
    return `${config.isMainApp ? '/analytics' : '/'}`;
  }, [config.isMainApp]);

  const resetTimerRef = useRef(null);

  const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
    return (
      <Grid xs={12} sx={{ textAlign: 'center', padding: theme.spacing(6) }}>
        <Typography variant="h2" sx={{ color: theme.palette.error.main }}>
          An error occurred
        </Typography>
        <Typography sx={{ padding: theme.spacing(2) }}>
          {error.message}
        </Typography>
        <Button
          variant="outlined"
          onClick={resetErrorBoundary}
          startIcon={
            <RefreshIcon
              sx={{ fontSize: `${theme.spacing(3.5)} !important` }}
            />
          }
        >
          Try again
        </Button>
      </Grid>
    );
  };

  const AnalitycsComponent = useMemo(
    () => (
      <div
        style={{
          height: '100vh',
          background: '#F6F5F7',
        }}
      >
        <IdlePopUp
          logOut={signOut}
          sendResetData={resetTimerRef}
          minutes={5}
          seconds={0}
          timer={{ minutes: 5, seconds: 0 }}
        />
        <Snackbar
          open={openAlert}
          type={type}
          content={content}
          onClose={handleCloseAlert}
          duration={3000}
        />
        <DisplayMaintenance
          open={displayMaintenance}
          underMaintenance={underMaintenance}
          handleDisplayMaintenanceDialog={handleDisplayMaintenanceDialog}
          maintenanceStartDate={maintenanceStartDate}
          maintenanceEndDate={maintenanceEndDate}
          maintenanceReason={maintenanceReason}
          fullLockout={fullLockout}
          bypassUser={isBypassUser}
          mainApp={config.isMainApp}
          logout={() => signOut()}
        />
        <Header
          title={'Enterprise Analytics'}
          logo={{ img: nexia_logo_img, path }}
          betaIcon={true}
          reportIssue={false}
          navLinkMenuList={navLinkMenuList}
          userMenu={{
            userName: names ? names[0] + ' ' + names[1] : '',
            userInitials: initials!,
          }}
          userMenuList={[
            {
              icon: sign_out_img,
              label: 'Logout',
              onClick: signOut,
            },
          ]}
          appsMenu={props.appsMenu}
        />
        {selectedReports['selectedReportId'] && (
          <ErrorBoundary fallbackRender={ErrorFallback}>
            <ReportBiClientComponent
              userName={names ? names[0] + ' ' + names[1] : ''}
              userEmail={email ?? ''}
              reset={resetTimerRef.current}
              openAlert={handleOpenAlert}
              closeAlert={handleCloseAlert}
              loadingReportSingle={handleLoadingReportSingle}
              selectFilterItemSelected={handleSelectFilterItemSelected}
              selectedReport={{
                reportId: selectedReports['selectedReportId'],
                reportName: selectedReportName,
              }}
              reportFilter={reportFilter}
              alertData={{
                openAlert,
                content,
                type,
              }}
            />
            <BackdropPowerBi open={loadingSingleReport} />
          </ErrorBoundary>
        )}
      </div>
    ),
    [
      names,
      email,
      selectedReports['selectedReportId'],
      reportFilter,
      loadingSingleReport,
      openAlert,
      reports,
      activityModal,
      displayMaintenance,
      loadData,
      underMaintenance,
      maintenanceStartDate,
      maintenanceEndDate,
      maintenanceReason,
      fullLockout,
    ]
  );

  return (
    <>
      {anltPermissions ? (
        <Route path={path}>{AnalitycsComponent}</Route>
      ) : (
        <Route path={path}>
          <NotAuthorized signOut={signOut} />
        </Route>
      )}
    </>
  );
};
