import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { appInsights } from "../AppInsights";
import { IUserInfo, ITracker } from '../models/interfaces';

export const useAppInsightHook = () => {
    const trackException = (error: string) => {
        appInsights && appInsights.trackException({ error: new Error(error), severityLevel: SeverityLevel.Error });
    }
    const useTrackEvent = ({name, user, message} : ITracker) => {
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
                    time: loadData.time
                }
            })
        } else {
            appInsights && appInsights.trackEvent({
                name,
                properties: {
                    displayName: user?.name,
                    email: user?.email,
                    message 
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
    const HandleUserEvent = (user: IUserInfo, message?: string, type?: string) => {
        useTrackEvent({ name: type? type : "errorType", user, message: message? message : "Error message" });
    }
    return {
        HandleUserLogOut,
        HandleUserLogIn,
        trackException,
        HandleUserEvent
    }
}
