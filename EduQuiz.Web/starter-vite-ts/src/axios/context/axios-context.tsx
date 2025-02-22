import { createContext } from 'react';
import { AxiosInstance, AxiosResponse } from "axios";

interface AuthContextProps {
  jwt: string | undefined;
  axiosLogin: AxiosInstance;
  axiosDefault: AxiosInstance;
  setJwt: (jwt: string) => void;
  postAuth: (url: string, data: any) => Promise<AxiosResponse>;
  getAuth: (url: string, options?: any) => Promise<AxiosResponse>;
}

export const AxiosContext = createContext<AuthContextProps | undefined>(undefined);
