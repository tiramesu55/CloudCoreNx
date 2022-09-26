/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConfigCtx, IConfig, useClaimsAndSignout } from '@cloudcore/okta-and-config';
import { FC } from "react";
import {Header} from '@cloudcore/ui-shared'

/* eslint-disable react-hooks/exhaustive-deps */
import { useOktaAuth } from "@okta/okta-react";
import { useContext, useEffect, useRef, useState } from "react";
import {HeaderLayout} from '@cloudcore/ui-shared'

import { ListReports } from "./components/ListReports";
// import {ReportBiClientComponent} from  "@cloudcore/powerbi"
import { Box } from "@mui/system";
//import useAppInsightHook from "../hooks/AppInsightHook/AppInsightHook";
import service from "./service/service";
//import { IErrorTypeResponse } from "../models/interfaces";
import {NotAuthorized} from "@cloudcore/ui-shared";
//import IdlePopUp from "../components/idleTimeOut/idlePopup";
//import { useIdleTimer } from "react-idle-timer";

import { IErrorTypeResponse } from "./models/interfaces";
import {useAppInsightHook} from "@cloudcore/common-lib";

import { reportsActions, useAppDispatch } from "@cloudcore/redux-store";
/* eslint-disable-next-line */
export interface AnalyticsPowerbiProps {}

export const AnalyticsPowerbi = () => {
  const config: IConfig  = useContext(ConfigCtx)!;   // at this point config is not null (see app)
  const dispatch = useAppDispatch();
  const {signOut, getClaims } = useClaimsAndSignout( config.logoutSSO,config.postLogoutRedirectUri);
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [authorizedState, setAuthorizedState] = useState<boolean>(true);
  const [listReportLoading, setListReportLoading] = useState<boolean>(false);
  const [activityModal, setActivityModal] = useState<boolean>(false);
  const { authState, oktaAuth } = useOktaAuth();
  
  const sessionTimeoutRef: any = useRef(null);
  const { loadReports, openAlert } = reportsActions;

const { HandleUserLogOut,  HandleUserLogIn, HandleUserEvent } = useAppInsightHook();

  const handleErrorResponse = (err: IErrorTypeResponse) => {
    HandleUserEvent(
      {
        name: userName,
        email: userEmail,
      },
      err?.message,
      err?.type
    );
    openAlert(
      err?.message ? err.message : "Error response",
      err.status ? err.status : 0
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
            .get(
              config?.REACT_APP_SUITES_URL,
              {
                "Content-Type": "application/json",
                Authorization: authState?.accessToken?.accessToken
                  ? `Bearer ${authState?.accessToken?.accessToken}`
                  : "",
              }
            )
            .then((response) => {
              console.log("response.suites", response.suites)
              setListReportLoading(false);
              dispatch(loadReports(response.suites));
            })
            .catch((error) => {
              setListReportLoading(false);
              handleErrorResponse({
                type: "GetGroupReports",
                message: error.message,
                status: error.status ? error.status : 401,
                messageToShow: error.message,
              });
            });
        }
      }
      const claims = authState.accessToken?.claims as any;
      if (claims?.initials) {
        setUserName(claims?.initials.join(" "));
        setUserInitials(
          claims?.initials.map((name: string) => name[0].toUpperCase()).join("")
        );
      }
      if (claims?.sub) {
        setUserEmail(claims?.sub);
      }
    }
  }, [])

  // const signOut = async () => {
  //   //get token
  //   //return access token from out custom hook
  //   //const accessToken = oktaAuth.getAccessToken() ?? "";
  //   //create a request for
  //   const request = new Request(config ? config.logoutSSO : "", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     method: "GET",
  //   });
  //   try {
  //     const response = await fetch(request);
  //     if (!response.ok) {
  //       console.log(`HTTP error in closing Session: ${response.status}`);
  //     }
  //     console.log("session closed");
  //   } catch (ex) {
  //     console.log(ex);
  //   } finally {
  //     oktaAuth.signOut({
  //       postLogoutRedirectUri: config?.postLogoutRedirectUri, //'https://ssotest.walgreens.com/idp/idpLogout',
  //       revokeAccessToken: true,
  //     });
  //     HandleUserLogOut({
  //       name: userName,
  //       email: userEmail,
  //     });
  //   }
  // };



  // //idle timeout
  // const handleOnIdle = () => {
  //   if (!activityModal) {
  //     setActivityModal(true);
  //     sessionTimeoutRef.current = setTimeout(logOut, 1000 * 298);
  //   }
  // };

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

  // const { getLastActiveTime, reset } = useIdleTimer({
  //   timeout: 1000 * 1500,
  //   onIdle: handleOnIdle,
  //   onActive: handleActive,
  //   debounce: 500,
  // });
  //idle timeout

  return (
    <>
      {/* if not authorized then go to route unauthorized  */}
        <>
          {/* <IdlePopUp
            open={activityModal}
            logOut={logOut}
            userActive={userActive}
            minutes={5}
            seconds={0}
            timer={{ minutes: 5, seconds: 0 }}
          /> */}
          <HeaderLayout signOut={signOut} title="Marketplace">
          {/* <Header userEmail={userEmail} userName={userName} initials={userInitials} /> need a full header*/}
          <Box sx={{ display: "flex" }}>
            <ListReports
              listReportLoading={listReportLoading}
              userName={userName}
              userEmail={userEmail}
            />
            {/* {selectedReportId && (
              <ReportBiClientComponent
                userName={userName}
                userEmail={userEmail}
                reset={reset}
              />
            )} */}
          </Box>
          </HeaderLayout>
        </>
     
        {/* <NotAuthorized postRedirect={config?.postLogoutRedirectUri!} /> */}

    </>
  );
}