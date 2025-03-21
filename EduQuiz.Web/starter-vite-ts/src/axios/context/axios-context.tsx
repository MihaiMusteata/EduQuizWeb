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
  isLoading: boolean;
}

export const AxiosContext = createContext<AuthContextProps | undefined>(undefined);
