import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { appInsights } from "../AppInsights";
import {  IUserInfo, ITracker, IAppInsight } from '../models/interfaces';

export const useAppInsightHook = () => {
    const trackException = (error: string) => {
        appInsights && appInsights.trackException({ error: new Error(error), severityLevel: SeverityLevel.Error });
    }
    
    const HandleUserLogIn = ( data: IAppInsight ) => {
        const isLogged = sessionStorage.getItem('isLogged');
        if(!isLogged){
            sessionStorage.setItem('isLogged', 'Y');
            const { properties } = data;
            appInsights && appInsights.trackEvent({
                name: "User LogIn",
                properties
            })
        }
    }
    const HandleUserLogOut = ( data: IAppInsight ) => {
        const { properties } = data;
        appInsights && appInsights.trackEvent({
            name: "User LogOut",
            properties
        })
        sessionStorage.removeItem('isLogged')
    }

    const HandleReportEvent = ( data: IAppInsight ) => {
        const { type, properties } = data;
        appInsights && appInsights.trackEvent({
            name: type? type : "ReportEvent",
            properties
        })
    }

    return {
        HandleReportEvent,
        HandleUserLogOut,
        HandleUserLogIn,
        trackException
    }
}
