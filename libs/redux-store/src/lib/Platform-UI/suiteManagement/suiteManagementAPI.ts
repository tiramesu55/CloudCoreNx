import axios from "axios";
import { Suite } from "./suiteManagementSlice";

export const getWorkspaceIdByDomain = (url : string, domain : string, token: string) => axios.get(`${url}/GetAnalyticsObjectByDomain/AnalyticsWorkspace/${domain}`,{
    headers: {
      'Authorization': `Bearer ${token}`
        }
    }
    );

export const getSuitesByDomain = (url : string, domain : string, token: string) => axios.get(`${url}/GetAnalyticsObjectByDomain/AnalyticsSuite/${domain}`,{
      headers: {
        'Authorization': `Bearer ${token}`
          }
      }
      );

export const getAvailableReports = (url : string, workSpaceId : string, token : string) => 
      axios.get(`${url}/Reports/Group/${workSpaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

export const addSuite = (url : string, suite: Suite, token: string) => axios.post(`${url}/Analytics/Add/AnalyticsSuite`, suite,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
        );

export const updateSuite = (url : string, suite: Suite, token: string) => axios.put(`${url}/UpdateSuite`, suite,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  );

export const updateWorkSpaceIdByDomain = (url : string, data : { domain: string,
    workspaceId: string,}, token : string) => 
    axios.put(`${url}/UpdateWorkspaceByDomain`, data , {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

export const deleteSuite = (url : string, id : string, token: string) => axios.delete(`${url}/Analytics/Drop/AnalyticsSuite/${id}`,{
  headers: {
    'Authorization': `Bearer ${token}`
      }
  }
  );

