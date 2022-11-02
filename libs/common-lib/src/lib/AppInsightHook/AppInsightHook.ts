import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { appInsights } from "../AppInsights";
import { IUiReport, IUserInfo, ITracker } from '../models/interfaces';

export const useAppInsightHook = () => {
    const trackException = (error: string) => {
        appInsights && appInsights.trackException({ error: new Error(error), severityLevel: SeverityLevel.Error });
    }
    const useTrackEvent = ({name, user, message, reportInfo} : ITracker) => {
        const isLogged = sessionStorage.getItem('isLogged');
        if(name === "User LogIn" && !isLogged){
            sessionStorage.setItem('isLogged', 'Y');
            appInsights && appInsights.trackEvent({
                name,
                properties: {
                    displayName: user?.name,
                    email: user?.email
                }
            })
        } else if(name === "User LogOut") {
            appInsights && appInsights.trackEvent({
                name,
                properties: {
                    displayName: user?.name,
                    email: user?.email
                }
            })
            sessionStorage.removeItem('isLogged')
        } else if(name === "GetReportLoading"){
            const loadData = message? JSON.parse(message) : {
                id: "",
                time: 0
            };
            appInsights && appInsights.trackEvent({
                name,
                properties: {
                    displayName: user?.name,
                    email: user?.email,
                    id: loadData.id,
                    name: loadData.name,
                    time: loadData.time
                }
            })
        } else {
            appInsights && appInsights.trackEvent({
                name,
                properties: {
                    displayName: user?.name,
                    email: user?.email,
                    message,
                    reportInfo 
                }
            })
        }       
    }
    const HandleUserLogIn = (user: IUserInfo) => {
        useTrackEvent({ name: "User LogIn", user });
    }
    const HandleUserLogOut = (user: IUserInfo) => {
        useTrackEvent({ name: "User LogOut", user });
    }
    const HandleUserEvent = (user: IUserInfo, message?: string, type?: string, reportInfo?: IUiReport) => {
        useTrackEvent({ name: type? type : "errorType", user, message: message? message : "Error message", reportInfo });
    }
    return {
        HandleUserLogOut,
        HandleUserLogIn,
        trackException,
        HandleUserEvent
    }
}
