import axios from 'axios';

export const getDashboardDetailsApi = (url : string,params:string,token: string) => axios.get(`${url}/Dashboard`, {
    params,
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
);