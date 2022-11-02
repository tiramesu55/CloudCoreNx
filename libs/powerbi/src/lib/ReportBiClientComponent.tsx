/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import ReportEmbedding from './ReportEmbeddingClass';
import { throttle } from 'throttle-debounce';
import { useAppInsightHook, IErrorTypeResponse } from '@cloudcore/common-lib';
import { ErrorBoundary } from 'react-error-boundary';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    visibility: 'visible',
  },

  reportOptionsContainer: {
    display: 'inline-block',
  },
}));

export const ReportBiClientComponent = ({
  userName,
  userEmail,
  reset,
  openAlert,
  loadingReportSingle,
  selectFilterItemSelected,
  selectedReportId,
  reportFilter,
}: {
  userName: string;
  userEmail: string;
  reset: () => void;
  openAlert: (message: string, type: number) => void;
  loadingReportSingle: (v: boolean) => void;
  selectFilterItemSelected: (filter: string[], operator: string) => void;
  selectedReportId: string;
  reportFilter: any;
}) => {
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const reportContainer = React.createRef<HTMLDivElement>();
  const reportEmbedding = new ReportEmbedding();

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [containerCurrent, setContainerCurrent] =
    useState<HTMLDivElement | null>(null);
  const { HandleUserEvent } = useAppInsightHook();

  const handleErrorOrLogResponse = (err: IErrorTypeResponse) => {
    console.log('handleErrorResponse function', err);
    HandleUserEvent(
      {
        name: userName,
        email: userEmail,
      },
      err?.message,
      err?.type
    );
    if (!err.justEventSend) {
      openAlert(
        err?.messageToShow ? err.messageToShow : 'Error response',
        err.status ? err.status : 0
      );
    }
  };
  //this gets a PowerBi auth token
  const getToken = async (reportContainer: HTMLDivElement) => {
    const request = new Request(config ? config.REACT_APP_POWERBI_URL! : '', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token ? token : ''}`,
      },
      method: 'POST',
      body: JSON.stringify({ reportId: selectedReportId }),
    });
    try {
      const response = await fetch(request);
      const data = await response.json();
      reportContainer &&
        reportEmbedding.setActualToken(reportContainer, data.accessToken);
      await handleTokenExpiration(reportContainer);
    } catch (err) {
      if (err instanceof Error) {
        const errorData = JSON.parse(err.message);
        let errorText;
        try {
          errorText = JSON.parse(errorData.text);
        } catch (e) {
          errorText = 'Unknown Report Error';
        }
        //display alert
        handleErrorOrLogResponse({
          type: errorData.type ? errorData.type : 'GetReportError',
          message: errorText.message ? errorText.message : errorText,
          status: errorData.status,
          justEventSend: false,
          messageToShow: errorText.messageToShow
            ? errorText.messageToShow
            : errorText,
        });
      } else {
        //if err is not of the correct type.  Impossible
      }
    }
  };

  const handleTokenExpiration = (reportContainer: HTMLDivElement) => {
    timer && clearTimeout(timer);
    const timeoutMilliseconds = 55 * 60 * 1000;
    const timerTmp = setTimeout(() => {
      getToken(reportContainer);
    }, timeoutMilliseconds);
    setTimer(timerTmp);
  };

  const throttlesetActualHeight = throttle(500, false, () => {
    const { innerHeight: height } = window;
    if (containerCurrent) {
      containerCurrent.style.height = `${height - 100}px`;
    }
  });

  useEffect(() => {
    window.removeEventListener('resize', throttlesetActualHeight);
    window.addEventListener('resize', throttlesetActualHeight);
    return () => window.removeEventListener('resize', throttlesetActualHeight);
  }, [containerCurrent]);

  const isMobileViewport = false;

  const classes = useStyles();
  const embeding = (
    reportId: string,
    reportContainer: HTMLDivElement,
    isMobileViewport: boolean
  ): void => {
    reportEmbedding.resetElem(reportContainer);
    reportContainer.style.visibility = 'visible';
    //actually run report
    reportEmbedding.embedReport(
      reportId,
      reportContainer,
      isMobileViewport,
      token ? token : '',
      config ? config.REACT_APP_POWERBI_URL! : '',
      handleErrorOrLogResponse,
      loadingReportSingle,
      reportFilter,
      selectFilterItemSelected,
      reset
    );
  };

  useEffect(() => {
    if (reportContainer?.current && selectedReportId) {
      embeding(selectedReportId, reportContainer.current, isMobileViewport);
      handleTokenExpiration(reportContainer.current);
      setContainerCurrent(reportContainer.current);
    }
  }, [selectedReportId]);

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          <h1>An error occurred: {error.message}</h1>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}
    >
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
        }}
        id="container"
        ref={reportContainer}
        className={classes.container}
        onClick={() => console.log('From container')}
      />
    </ErrorBoundary>
  );
};
