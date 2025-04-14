import type { ReactNode} from "react";
import type { HubConnection} from "@microsoft/signalr";

import React, { useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

import { CONFIG } from "src/global-config";

import { SignalRContext } from './context/signalR-context'

type Props = {
  children: ReactNode;
}
type SignalRHandler = (...args: unknown[]) => void;
export const SignalRProvider = ({ children }: Props) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [registeredHandlers, setRegisteredHandlers] = useState<Map<string, Set<SignalRHandler>>>(new Map());

  const connect = async () => {
    if (connection) {
      return;
    }

    const conn = new HubConnectionBuilder()
      .withUrl(`${CONFIG.hubUrl}/quiz-session`)
      .withAutomaticReconnect()
      .build();

    try {
      await conn.start();
      setConnection(conn);
    } catch (error) {
      console.error("Error while starting connection: ", error);
    }
  };

  const disconnect = () => {
    if (connection) {
      connection.stop().then(() => {
        setConnection(null);
      }).catch((error) => {
        console.error("Error while disconnecting: ", error);
      });
    }
  };

  const registerHandler = (event: string, handler: SignalRHandler) => {
    setRegisteredHandlers((prevHandlers) => {
      const newHandlers = new Map(prevHandlers);
      if (!newHandlers.has(event)) {
        newHandlers.set(event, new Set());
      }
      newHandlers.get(event)?.add(handler);

      if (connection) {
        connection.on(event, handler);
      }

      return newHandlers;
    });
  };

  const unregisterHandler = (event: string, handler:SignalRHandler) => {
    setRegisteredHandlers((prevHandlers) => {
      const newHandlers = new Map(prevHandlers);
      newHandlers.get(event)?.delete(handler);

      if (connection) {
        connection.off(event, handler);
      }

      return newHandlers;
    });
  };

  return (
    <SignalRContext.Provider
      value={{
        connection,
        connect,
        disconnect,
        registerHandler,
        unregisterHandler
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};
