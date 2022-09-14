import axios from "axios";
import { Application } from "./applicationsSlice";

export const getApplicationsApi = (url : string, token: string) => axios.get(`${url}/Platform/PlatformApplication`, {
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
    );


export const updateApplicationApi = (app: Application, url : string, token: string) => axios.put(`${url}/UpdateApplication`, app, {
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
    );


export const addApplicationApi = (app: Application, url : string, token: string) => axios.post(`${url}/Platform/Add/PlatformApplication`, app, {
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
    );


