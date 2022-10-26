import axios from "axios";
import { Configuration } from "./configurationSlice";

export const getConfigApi = (url : string, token: string) => axios.get(`${url}/config`, {
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
);

export const updateConfigApi = (app: Configuration, url : string, token: string) => axios.put(`${url}/config`, app, {
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
    );
