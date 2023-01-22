import axios from 'axios';

export const getUserConfigApi = (url: string, token: string) =>
  axios.get(`${url}/UserConfiguration`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const upsertUserConfigApi = (url: string, token: string, data: any) =>
  axios.put(`${url}/UserConfiguration`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
