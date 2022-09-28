import axios from "axios";
import { Organization } from "./organizationsSlice";

export const getOrganizationssApi = (url : string, token: string) => axios.get(`${url}/Platform/PlatformOrganization`,{
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
    );

export const updateOrganization = (url : string, token: string, organization: Organization) => axios.put(`${url}/UpdateOrganization`, organization,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  );

export const addOrganization = (url : string, token: string, organization: Organization) => axios.post(`${url}/Platform/Add/PlatformOrganization`, organization,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  );