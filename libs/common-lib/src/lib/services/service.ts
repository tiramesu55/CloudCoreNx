/* eslint-disable @typescript-eslint/ban-types */
import axios, { AxiosResponse } from "axios";

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, headers: {}) =>
    axios
      .get(url, {
        headers,
      })
      .then(responseBody),
  post: (url: string, body: {}, headers: {}) =>
    axios
      .post(url, body, {
        headers
      })
      .then(responseBody),
  put: (url: string, body: {}, headers: {}) =>
    axios
      .put(url, body, {
        headers,
      })
      .then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    const formData = new FormData();
    formData.append("File", file);
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const GetConfig = () => requests.get("/assets/config.json", {});

export default { GetConfig, requests };
