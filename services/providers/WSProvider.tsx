import React, { useEffect, useState, useContext } from 'react';
import io, { Socket } from 'socket.io-client';

const isDebug = process.env.NODE_ENV === 'development';

export type Context = {
  socket?: Socket;
};

export const context = React.createContext<Context>({});

export const useWs = () => useContext(context);

export function WSProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket>();
  const createSocket = async () => {
    await fetch('/api/socket');
    const ioSocket = io();
    setSocket(ioSocket);

    if (isDebug) {
      ioSocket.onAny((event, ...args) => {
        console.debug('[WS]', event, args);
      });
    }
  };

  useEffect(() => {
    createSocket();
  }, []);

  return <context.Provider value={{ socket }}>{children}</context.Provider>;
}
