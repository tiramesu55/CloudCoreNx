/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import ReportEmbedding from "./ReportEmbeddingClass";
import { useOktaAuth } from "@okta/okta-react";
import { throttle } from "throttle-debounce";
import { useAppInsightHook } from "@cloudcore/common-lib";
import { IErrorTypeResponse } from "./models/interfaces";
import { ConfigCtx, IConfig } from '@cloudcore/okta-and-config';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: "100%",
    visibility: "visible",
    marginTop: "70px",
  },

  button: {
    // margin: theme.spacing(1),
  },
  reportOptionsContainer: {
    borderBottom: "1px solid #eaeaea",
    marginBottom: "10px",
    display: "inline-block",
    width: "100%",
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
  reportFilter
}: {
  userName: string;
  userEmail: string;
  reset: () => void;
  openAlert: ( message: string, type: number ) => void; 
  loadingReportSingle: ( v : boolean) => void; 
  selectFilterItemSelected: (filter: string[], operator: string) => void;
  selectedReportId: string;
  reportFilter: any;
}) => {
  const config: IConfig  = useContext(ConfigCtx)!;   // at this point config is not null (see app)
  const reportContainer = React.createRef<HTMLDivElement>();
  const reportEmbedding = new ReportEmbedding();

  const { authState } = useOktaAuth();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [containerCurrent, setContainerCurrent] =
    useState<HTMLDivElement | null>(null);
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
    if (!err.justEventSend) {
      openAlert(
        err?.messageToShow ? err.messageToShow : "Error response",
        err.status ? err.status : 0
      );
    }
  };
  const getToken = async (reportContainer: HTMLDivElement) => {
    const request = new Request(config ? config.REACT_APP_POWERBI_URL! : "", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          authState?.accessToken?.accessToken
            ? authState?.accessToken?.accessToken
            : ""
        }`,
      },
      method: "POST",
      body: JSON.stringify({ reportId: selectedReportId }),
    });
    const response = await fetch(request)
      .then((res) => res.json())
      .catch((err) => {
        const errorData = JSON.parse(err.message);
        let errorText;
        try {
          errorText = JSON.parse(errorData.text);
        } catch (e) {
          errorText = err.text;
        }
        handleErrorResponse({
          type: errorData.type ? errorData.type : "GetReportError",
          message: errorText.message ? errorText.message : errorText,
          status: errorData.status,
          messageToShow: errorText.messageToShow
            ? errorText.messageToShow
            : errorText,
        });
      });
    reportContainer &&
      reportEmbedding
        .setActualToken(reportContainer, response.accessToken)
        .then(() => handleTokenExpiration(reportContainer));
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
    window.removeEventListener("resize", throttlesetActualHeight);
    window.addEventListener("resize", throttlesetActualHeight);
    return () => window.removeEventListener("resize", throttlesetActualHeight);
  }, [containerCurrent]);

  const isMobileViewport = false;

  const classes = useStyles();
  const embeding = (
    reportId: string,
    reportContainer: HTMLDivElement,
    isMobileViewport: boolean
  ): void => {
    reportEmbedding.resetElem(reportContainer);
    reportContainer.style.visibility = "visible";
    reportEmbedding.embedReport(
      reportId,
      reportContainer,
      isMobileViewport,
      authState?.accessToken?.accessToken
        ? authState?.accessToken?.accessToken
        : "",
      config ? config.REACT_APP_POWERBI_URL! : "",
      handleErrorResponse,
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
    <div
        style={{
          display: "flex",
          flexGrow: 1,
        }}
        id="container"
        ref={reportContainer}
        className={classes.container}
        onClick={() => console.log("From container")}
      />
  );
};


