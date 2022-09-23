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
 
};

const GetConfig = () => requests.get("/assets/config.json", {});

export default { GetConfig, requests };
