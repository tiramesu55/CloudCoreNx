/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import ReportEmbedding from './ReportEmbeddingClass';
import { throttle } from 'throttle-debounce';
import {
  useAppInsightHook,
  IErrorTypeResponse,
  IUiReport,
  ITracker,
  IAlert,
  IAlertData
} from '@cloudcore/common-lib';
import { SnackbarComponent } from '@cloudcore/ui-shared';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import "./style.css";

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
  closeAlert,
  loadingReportSingle,
  selectFilterItemSelected,
  selectedReport,
  reportFilter,
  alertData
}: {
  userName: string;
  userEmail: string;
  reset: () => void;
  openAlert: (message: IAlert) => void;
  closeAlert: () => void;
  loadingReportSingle: (v: boolean) => void;
  selectFilterItemSelected: (filter: string[], operator: string) => void;
  selectedReport: IUiReport;
  reportFilter: any;
  alertData: IAlertData;
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
  const { HandleReportEvent } = useAppInsightHook();
 
  const UseTrackEvent = ({name, user, message} : ITracker) => {
    if(name === "GetReportLoading"){
        const loadData = message? JSON.parse(message) : {
            reportId: "",
            reportName: "",
            reportLoadTime: 0
        };
        HandleReportEvent({
            type: name,
            properties: {
                userName: user?.name,
                emailId: user?.email,
                reportId: loadData.reportId,
                reportName: loadData.reportName, 
                reportLoadTime: loadData.reportLoadTime
            }
        })
    } else if((name === "Open Report")){
        const loadData = message? JSON.parse(message) : {
            reportId: "",
            reportName: ""
        };
        HandleReportEvent({
            type: name,
            properties: {
                userName: user?.name,
                emailId: user?.email,
                reportId: loadData.reportId, 
                reportName: loadData.reportName, 
            }
        })
    }
     else {
        HandleReportEvent({
            type: name,
            properties: {
                userName: user?.name,
                emailId: user?.email,
                message,
            }
        })
    }       
  }
  const handleErrorOrLogResponse = (err: IErrorTypeResponse) => {
    UseTrackEvent({
      user: {
        name: userName,
        email: userEmail,
      },
      message: err?.message ? err?.message : "Error!!!",
      name: err?.type ? err?.type : "errorType"
    }
    );
    if (!err.justEventSend) {
      openAlert({
        content: err?.messageToShow ? err.messageToShow : 'Error response',
        type: "error"
      });
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
      body: JSON.stringify({ reportId: selectedReport.reportId }),
    });
    try {
      const response = await fetch(request);
      const data = await response.json();
      reportContainer &&
        reportEmbedding.setActualToken(reportContainer, data.accessToken);
        handleTokenExpiration(reportContainer);  //@ todo Check this await
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

  const throttlesetActualHeight = throttle(100, false, () => {
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
 

  useEffect(() => {
    //declate embedding
    const  embeding = async (
      selectedReportId: string,
      reportContainer: HTMLDivElement,
      isMobileViewport: boolean
    ): Promise<void> => {
      reportEmbedding.resetElem(reportContainer);
      reportContainer.style.visibility = 'visible';
      //actually run report
      await reportEmbedding.embedReport(
        selectedReport,
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
    //call embedding
    if (reportContainer?.current && selectedReport.reportId) {
      embeding(
        selectedReport.reportId,
        reportContainer.current,
        isMobileViewport
      )
      handleTokenExpiration(reportContainer.current);
      setContainerCurrent(reportContainer.current);
    }
  
  }, [selectedReport.reportId]);

  return (
   <>
      <SnackbarComponent open={alertData.openAlert} type={alertData.type} content={alertData.content} onClose={closeAlert} duration={3000}/>
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
        }}
        id="container"
        ref={reportContainer}
        className={classes.container}
      />
   </>
  )
};
