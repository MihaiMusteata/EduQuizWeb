import type { AxiosInstance } from "axios";

import { createContext } from 'react';

interface AuthContextProps {
  jwt: string | undefined;
  axiosLogin: AxiosInstance;
  axiosDefault: AxiosInstance;
  setJwt: (jwt: string) => void;
  postAuth: <T = any> (url: string, data: any) => Promise<T>;
  putAuth: <T = any> (url: string, data: any) => Promise<T>;
  getAuth: <T = any>(url: string, options?: any) => Promise<T>;
  deleteAuth: <T = any> (url: string) => Promise<T>;
  patchAuth: <T = any> (url: string, data: any) => Promise<T>;
  getPublic: <T = any> (url: string, options?: any) => Promise<T>;
  postPublic: <T = any> (url: string, data: any) => Promise<T>;
  postAuthBlob: (url: string, data: any) => Promise<Blob>;
  uploadFileAuth: <T = any>(url: string, formData: FormData) => Promise<T>;
}

export const AxiosContext = createContext<AuthContextProps | undefined>(undefined);
