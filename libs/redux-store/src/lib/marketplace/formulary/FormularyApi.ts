import axios from 'axios';

export const getFormularyListApi = (
  url: string,
  params: string,
  token: string
) =>
  axios.get(`${url}/Formulary`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
