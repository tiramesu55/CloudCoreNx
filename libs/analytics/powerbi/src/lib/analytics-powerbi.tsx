/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Header,
  NotAuthorized,
  IdlePopUp,
  nexia_logo_img,
  sign_out_img,
} from '@cloudcore/ui-shared';
import { Backdrop as BackdropPowerBi } from '@cloudcore/ui-shared';
import { ReportBiClientComponent } from '@cloudcore/powerbi';
import { Box } from '@mui/system';
import { useIdleTimer } from 'react-idle-timer';
import {
  useAppInsightHook,
  IErrorTypeResponse,
  requests,
} from '@cloudcore/common-lib';
import { analyticsStore, reportsActions } from '@cloudcore/redux-store';
import { Route } from 'react-router-dom';

/* eslint-disable-next-line */
export interface AnalyticsPowerbiProps {}

export const AnalyticsPowerbi = () => {
  const { useAppDispatch, useAppSelector } = analyticsStore;
  const dispatch = useAppDispatch();

  const [listReportLoading, setListReportLoading] = useState<boolean>(false);
  const [activityModal, setActivityModal] = useState<boolean>(false);

  const {
    loadReports,
    openAlert,
    loadingReportSingle,
    selectFilterItemSelected,
    selectReport,
  } = reportsActions;

  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { signOut, token, initials, names, permissions, email } =
    useClaimsAndSignout(config.logoutSSO, config.postLogoutRedirectUri);

  const handleOpenAlert = (message: string, status: number) =>
    dispatch(openAlert(message, status));
  const handleLoadingReportSingle = (data: boolean) =>
    dispatch(loadingReportSingle(data));
  const handleSelectFilterItemSelected = (filter: string[], operator: string) =>
    dispatch(selectFilterItemSelected(filter, operator));

  const { loadingSingleReport, selectedReport, reportFilter, reports } =
    useAppSelector((state) => state.report);

  const { HandleReportEvent } = useAppInsightHook();
  const anltPermissions = permissions.analytics?.length > 0;
  const handleErrorResponse = (err: IErrorTypeResponse) => {
    HandleReportEvent({
      properties: {
        userName: names ? names[0] + ' ' + names[1] : '',
        emailId: email,
        message: err?.message,
      },
      type: err?.type? err.type : "ErrorType"
    });
    dispatch(
      openAlert(
        err?.message ? err.message : 'Error response',
        err.status ? err.status : 0
      )
    );
  };

  useEffect(() => {
    if (token) {
      if (config?.REACT_APP_SUITES_URL) {
        // setListReportLoading(true);  //  too quick. No point running spinner
        requests
          .get(config?.REACT_APP_SUITES_URL, {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          })
          .then((response) => {
            //   setListReportLoading(false);
            dispatch(loadReports(response.suites));
          })
          .catch((error) => {
            setListReportLoading(false);
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

  // Do some idle action like log out your user
  const onIdle = () => {
    signOut();
  };

  // Close Modal Prompt and reset the idleTimer
  const onActive = () => {
    setActivityModal(false);
    reset();
  };

  // opens modal prompt on timeout
  const onPrompt = () => {
    setActivityModal(true);
  };

  const { reset } = useIdleTimer({
    timeout: 1000 * 1500,
    onIdle,
    onActive,
    debounce: 500,
    onPrompt,
    promptTimeout: 1000 * 299,
  });

  const handleReportClick = (reportId: string, reportName: string) => {
    dispatch(
      selectReport({
        reportId: reportId,
        reportName: reportName,
      })
    );
    HandleReportEvent({
      properties: {
        userName: names ? names[0] + ' ' + names[1] : '',
        emailId: email,
        reportId: reportId,
        reportName: reportName,
      },
      type: 'Open Report'
    });
  };

  useEffect(() => {
    openSlaDashboard();
  }, [reports]);

  const openSlaDashboard = useCallback(() => {
    if (!reports) return;
    for (const x of reports!) {
      const slaDashId = x.reports?.find(
        (p) => p.reportName === 'SLA Dashboard'
      )?.reportId;

      if (slaDashId) {
        dispatch(
          selectReport({
            reportId: slaDashId,
            reportName: 'SLA Dashboard',
          })
        );
        break;
      }
    }
  }, [reports]);

  const navLinkMenuList = useMemo(() => {
    return reports
      ? reports?.map((item) => ({
          label: item.name,
          subMenuList: item.reports.map((report) => ({
            label: report.reportName,
            onClick: () =>
              handleReportClick(report.reportId, report.reportName),
          })),
        }))
      : [];
  }, [reports]);

  const path = useMemo(() => {
    return `${config.isMainApp ? '/analytics' : '/'}`;
  }, [config.isMainApp]);

  const AnalitycsComponent = useMemo(
    () => (
      <div
        style={{
          height: '100vh',
          background: '#F6F5F7',
        }}
      >
        <IdlePopUp
          open={activityModal}
          logOut={signOut}
          onActive={onActive}
          minutes={5}
          seconds={0}
          timer={{ minutes: 5, seconds: 0 }}
        />
        <Header
          title={'Analytics'}
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
        />
        {selectedReport.reportId && (
          <>
            <ReportBiClientComponent
              userName={names ? names[0] + ' ' + names[1] : ''}
              userEmail={email ?? ''}
              reset={reset}
              openAlert={handleOpenAlert}
              loadingReportSingle={handleLoadingReportSingle}
              selectFilterItemSelected={handleSelectFilterItemSelected}
              selectedReport={selectedReport}
              reportFilter={reportFilter}
            />
            <BackdropPowerBi open={loadingSingleReport} />
          </>
        )}
      </div>
    ),
    [names, email, selectedReport.reportId, reportFilter, loadingSingleReport]
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
