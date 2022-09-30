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
import { useOktaAuth } from '@okta/okta-react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@cloudcore/ui-shared';
import { BackdropPowerBi } from './components/BackDrop/Backdrop';
import { ReportBiClientComponent } from '@cloudcore/powerbi';
import { Box } from '@mui/system';
import service from './service/service';
import { NotAuthorized } from '@cloudcore/ui-shared';
import { IdlePopUp } from '@cloudcore/ui-shared';
import { useIdleTimer } from 'react-idle-timer';
import { IErrorTypeResponse } from './interfaces/interfaces';
import { useAppInsightHook } from '@cloudcore/common-lib';
import { analyticsStore, reportsActions } from '@cloudcore/redux-store';
import logo from './assets/Nexia-Logo2.png';
import logOutIcon from './assets/sign-out.svg';

/* eslint-disable-next-line */
export interface AnalyticsPowerbiProps {}

export const AnalyticsPowerbi = () => {
  const { useAppDispatch, useAppSelector } = analyticsStore;
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const dispatch = useAppDispatch();
  const { signOut, getClaims } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [authorizedState, setAuthorizedState] = useState<boolean>(true);
  const [listReportLoading, setListReportLoading] = useState<boolean>(false);
  const [activityModal, setActivityModal] = useState<boolean>(false);
  const { authState, oktaAuth } = useOktaAuth();

  const sessionTimeoutRef: any = useRef(null);
  const {
    loadReports,
    openAlert,
    loadingReportSingle,
    selectFilterItemSelected,
    selectReport,
  } = reportsActions;

  const handleOpenAlert = (message: string, status: number) =>
    dispatch(openAlert(message, status));
  const handleLoadingReportSingle = (data: boolean) =>
    dispatch(loadingReportSingle(data));
  const handleSelectFilterItemSelected = (filter: string[], operator: string) =>
    dispatch(selectFilterItemSelected(filter, operator));

  const { loadingSingleReport, selectedReportId, reportFilter, reports } =
    useAppSelector((state) => state.report);
  const { HandleUserEvent } = useAppInsightHook();

  const handleErrorResponse = (err: IErrorTypeResponse) => {
    HandleUserEvent(
      {
        name: userName,
        email: userEmail,
      },
      err?.message,
      err?.type
    );
    dispatch(
      openAlert(
        err?.message ? err.message : 'Error response',
        err.status ? err.status : 0
      )
    );
  };

  useEffect(() => {
    if (!authState?.isAuthenticated) {
      oktaAuth.signInWithRedirect();
    } else {
      if (!authState.accessToken?.claims['analytics']) {
        setAuthorizedState(false);
      } else {
        setAuthorizedState(true);
        // const payload = authState.accessToken?.claims['analytics'];
        if (config?.REACT_APP_SUITES_URL) {
          setListReportLoading(true);
          service.requests
            .get(config?.REACT_APP_SUITES_URL, {
              'Content-Type': 'application/json',
              Authorization: authState?.accessToken?.accessToken
                ? `Bearer ${authState?.accessToken?.accessToken}`
                : '',
            })
            .then((response) => {
              setListReportLoading(false);
              dispatch(loadReports(response.suites));
            })
            .catch((error) => {
              console.log(error);
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
      const claims = getClaims() as any;
      if (claims?.['initials']) {
        setUserName(claims?.['initials'].join(' '));
        setUserInitials(
          claims?.['initials']
            .map((name: string) => name[0].toUpperCase())
            .join('')
        );
      }
      if (claims?.sub) {
        setUserEmail(claims?.sub);
      }
    }
  }, []);

  const logOut = () => {
    clearTimeout(sessionTimeoutRef.current);
    signOut();
  };

  //idle timeout
  const handleOnIdle = () => {
    if (!activityModal) {
      setActivityModal(true);
      sessionTimeoutRef.current = setTimeout(logOut, 1000 * 298);
    }
  };

  const handleActive = () => {
    if (!activityModal) {
      clearTimeout(sessionTimeoutRef.current);
    }
  };

  const userActive = () => {
    // isIdle && idleTimerReset();
    clearTimeout(sessionTimeoutRef.current);
    setActivityModal(false);
  };

  const { reset } = useIdleTimer({
    timeout: 1000 * 1500,
    onIdle: handleOnIdle,
    onActive: handleActive,
    debounce: 500,
  });

  const handleReportClick = (reportId: string) => {
    oktaAuth.session.exists().then(function (exists) {
      if (exists) {
        console.log('session is there');
        dispatch(selectReport(reportId));
        HandleUserEvent(
          {
            name: userName,
            email: userEmail,
          },
          reportId,
          'SelectReportId'
        );
      } else {
        console.log('Session Expired');
          oktaAuth.signOut({
            postLogoutRedirectUri: config?.postLogoutRedirectUri, // "https://ssotest.walgreens.com/idp/idpLogout",
            revokeAccessToken: true,
          });
      }
    });
  };

  useEffect(() => {
    openSlaDashboard();
  }, [reports]);

  const openSlaDashboard = () => {
    reports?.map((item: { reports: any[] }, index: any) => {
      item.reports.map((sub: { reportName: string; reportId: any }, i: any) => {
        if (sub.reportName === 'SLA Dashboard') {
          oktaAuth
            .getUser()
            .then((info) => {
              dispatch(selectReport(sub.reportId));
              HandleUserEvent(
                {
                  name: info
                    ? info.family_name + ' ' + info.given_name
                    : 'unknownUser',
                  email: info ? info.email : 'unknownEmail',
                },
                sub.reportId,
                'SelectReportId'
              );
            })
            .catch((e) => {
              console.log('Session Expired');
              // oktaAuth.signOut({
              //   postLogoutRedirectUri: config?.postLogoutRedirectUri, // "https://ssotest.walgreens.com/idp/idpLogout",
              //   revokeAccessToken: true,
              // });
            });
        }
      });
    });
  };
  const navLinkMenuList = useMemo(() => {
    return reports?.map((item) => ({
      label: item.name,
      subMenuList: item.reports.map((report) => ({
        label: report.reportName,
        onClick: () => handleReportClick(report.reportId),
      })),
    }));
  }, [reports]);

  return (
    <>
      {authorizedState ? (
        <>
          <IdlePopUp
            open={activityModal}
            logOut={logOut}
            userActive={userActive}
            minutes={5}
            seconds={0}
            timer={{ minutes: 5, seconds: 0 }}
          />
          <Header
            title={'Analytics'}
            logo={{ img: logo, path: '/' }}
            betaIcon={true}
            reportIssue={false}
            navLinkMenuList={navLinkMenuList}
            userMenu={{
              userName: userName,
              userInitials: userInitials,
            }}
            userMenuList={[
              {
                icon: logOutIcon,
                label: 'Logout',
                onClick: signOut,
              },
            ]}
          />
          <Box sx={{ display: 'flex' }}>
            {selectedReportId && (
              <>
                <ReportBiClientComponent
                  userName={userName}
                  userEmail={userEmail}
                  reset={reset}
                  openAlert={handleOpenAlert}
                  loadingReportSingle={handleLoadingReportSingle}
                  selectFilterItemSelected={handleSelectFilterItemSelected}
                  selectedReportId={selectedReportId}
                  reportFilter={reportFilter}
                />
                <BackdropPowerBi loadingState={loadingSingleReport} />
              </>
            )}
          </Box>
        </>
      ) : (
        <NotAuthorized signOut={signOut} />
      )}
    </>
  );
};
