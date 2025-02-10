import { useState, ReactNode } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

import { getJwt } from "../auth/context/jwt";
import { AxiosContext } from "./context/axios-context";
import { endpoints } from "./endpoints";

export const AxiosProvider = ({ children }: { children: ReactNode }) => {

  const [ jwt, setJwt ] = useState<string | undefined>(getJwt());

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL as string,
    headers: {
      Authorization: jwt ? `Bearer ${jwt}` : undefined,
    },
  });

  const axiosLogin: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL as string,
    withCredentials: true,
  });

  const postAuth = (url: string, data: any): Promise<AxiosResponse> =>
    axiosInstance.post(url, data);

  const getAuth = (url: string, options?: any): Promise<AxiosResponse> =>
    axiosInstance.get(url, options);

  axiosInstance.interceptors.request.use(
    async (config) => {
      config.headers.Authorization = jwt ? `Bearer ${jwt}` : undefined;
      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await axiosLogin.post(endpoints.auth.refresh, { jwtToken: jwt });
          if (response.status === 401) {
            sessionStorage.removeItem("jwtToken");
          }

          const { jwtToken } = response.data;

          sessionStorage.setItem("jwtToken", jwtToken);
          setJwt(jwtToken);
          originalRequest.headers.Authorization = `Bearer ${jwtToken}`;

          return axios(originalRequest);
        } catch (er) {
          sessionStorage.removeItem("jwtToken");
        }
      } else if (error.response.status === 403) {
        console.error("403 error", error.response.data);
      } else {
        return Promise.reject(error);
      }
      return Promise.reject(error);
    },
  );

  return (
    <AxiosContext.Provider
      value={{
        axiosLogin,
        setJwt,
        postAuth,
        getAuth,
      }}
    >
      {children}
    </AxiosContext.Provider>
  );
};
