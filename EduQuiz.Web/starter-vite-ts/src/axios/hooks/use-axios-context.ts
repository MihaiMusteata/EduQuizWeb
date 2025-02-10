import {useContext} from "react";

import {AxiosContext} from "../context/axios-context";

export function useAxios() {
  const context = useContext(AxiosContext);
  if (context === undefined) {
    throw new Error("useAxios must be used within a AxiosProvider");
  }
  return context;
}
