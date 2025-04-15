import type { ReactNode } from "react";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import axios from "axios";
import { useState } from "react";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { toast } from 'src/components/snackbar';

import { endpoints } from "./endpoints";
import { getJwt } from "../auth/context/jwt";
import { AxiosContext } from "./context/axios-context";

export const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const [jwt, setJwt] = useState<string | undefined>(getJwt());
  const router = useRouter();

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL as string,
    headers: {
      Authorization: jwt ? `Bearer ${jwt}` : undefined,
      'X-User-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const axiosLogin: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL as string,
    withCredentials: true,
  });

  const axiosDefault: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL as string,
  });

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
            localStorage.removeItem("jwtToken");
            router.push(paths.auth.jwt.signIn);
            toast.error("Sesiunea a expirat. Redirectionare la pagina de login.");
          }

          const { jwtToken } = response.data;

          localStorage.setItem("jwtToken", jwtToken);
          setJwt(jwtToken);
          originalRequest.headers.Authorization = `Bearer ${jwtToken}`;

          return axios(originalRequest);
        } catch (er) {
          router.push(paths.auth.jwt.signIn);
          console.log("RefreshError : ", er);
          localStorage.removeItem("jwtToken");
        }
      } else if (error.response.status === 403) {
        console.error("403 error", error.response.data);
      } else {
        return Promise.reject(error);
      }
      return Promise.reject(error);
    },
  );

  const requestHandler = async <T = any>(request: () => Promise<AxiosResponse<T>>): Promise<T> => {
    try {
      const response = await request();
      return response.data;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const error = e as AxiosError;
        switch (error.response?.status) {
          case 403:
            router.push(paths.page403);
            break;
          case 404:
            router.push(paths.page404);
            break;
          case 500:
            router.push(paths.page500);
            break;
          default:
            toast.error("S-a produs o eroare.");
        }
      } else {
        toast.error("Eroare necunoscută.");
        console.error("Unexpected error:", e);
      }
      throw e;
    }
  };

  const postAuth = <T = any>(url: string, data: any) =>
    requestHandler(() => axiosInstance.post<T>(url, data));
  const putAuth = <T = any>(url: string, data: any) =>
    requestHandler(() => axiosInstance.put<T>(url, data));
  const getAuth = <T = any>(url: string, options?: any) =>
    requestHandler(() => axiosInstance.get<T>(url, options));
  const patchAuth = <T = any>(url: string, data: any) =>
    requestHandler(() => axiosInstance.patch<T>(url, data));
  const deleteAuth = <T = any>(url: string) =>
    requestHandler(() => axiosInstance.delete<T>(url));
  const postAuthBlob = async (url: string, data: any): Promise<Blob> => {
    try {
      const response = await axiosInstance.post(url, data, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      toast.error("Eroare la export.");
      throw error;
    }
  };
  const uploadFileAuth = <T = any>(url: string, formData: FormData) =>
    requestHandler(() =>
      axiosInstance.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    );

  const postPublic = <T = any>(url: string, data: any) =>
    requestHandler(() => axiosDefault.post<T>(url, data));
  const getPublic = <T = any>(url: string, options?: any) =>
    requestHandler(() => axiosDefault.get<T>(url, options));

  return (
    <AxiosContext.Provider
      value={{
        jwt,
        axiosLogin,
        axiosDefault,
        setJwt,
        postAuth,
        putAuth,
        getAuth,
        deleteAuth,
        patchAuth,
        getPublic,
        postPublic,
        postAuthBlob,
        uploadFileAuth,
      }}
    >
      {children}
    </AxiosContext.Provider>
  );
};
