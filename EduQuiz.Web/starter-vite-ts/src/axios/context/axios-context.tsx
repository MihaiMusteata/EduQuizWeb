import type { AxiosInstance, AxiosResponse } from "axios";

import { createContext } from 'react';

interface AuthContextProps {
  jwt: string | undefined;
  axiosLogin: AxiosInstance;
  axiosDefault: AxiosInstance;
  setJwt: (jwt: string) => void;
  postAuth: (url: string, data: any) => Promise<AxiosResponse>;
  getAuth: <T = any>(url: string, options?: any) => Promise<T>;
}

export const AxiosContext = createContext<AuthContextProps | undefined>(undefined);
