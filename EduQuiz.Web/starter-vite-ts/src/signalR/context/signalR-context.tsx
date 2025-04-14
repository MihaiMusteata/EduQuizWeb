import type { HubConnection } from "@microsoft/signalr";

import { createContext } from "react";

interface SignalRContextType {
  connection: HubConnection | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  registerHandler: (event: string, handler: (...args: any[]) => void) => void;
  unregisterHandler: (event: string, handler: (...args: any[]) => void) => void;
}

export const SignalRContext = createContext<SignalRContextType | undefined>(undefined);
