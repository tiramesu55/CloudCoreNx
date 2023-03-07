import axios from 'axios';

export const getLabelSettingsApi = (
  url: string,
  params: string,
  token: string
) =>
  axios.get(`${url}/LabelConfiguration`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
