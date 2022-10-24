import axios from "axios";
import { Site } from "./siteSlice";

export const getSitesByOrganizationApi = (url : string, token: string, orgCode : string) => axios.get(`${url}/GetByOrganization/PlatformSite/${orgCode}`, {
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
    );

export const updateSiteApi = (url : string, token: string, site: Site) => axios.put(`${url}/UpdateSite`, site, {
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
    );

export const addSiteApi = (url : string, token: string, site: {}) => axios.post(`${url}/Platform/Add/PlatformSite`, site, {
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
    );

export const deleteSiteApi = (url : string, token: string, id : string) => axios.delete(`${url}/Platform/PlatformSite/${id}`,{
  headers: {
    'Authorization': `Bearer ${token}`
      }
})

