import React, { useCallback, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

import { COMMANDS } from '@/utils/constants';
import { useWs } from './WSProvider';
import { VendorService } from '../VendorService';

export type Context = {
  vendors: VendorService[];
  refresh: () => void;
  setVendors: (_: VendorService[]) => void;
};

export const context = React.createContext<Context>({
  vendors: [],
  refresh: () => {},
  setVendors: () => {},
});

export const useVendors = () => React.useContext(context);

export function VendorsProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useWs();
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState<VendorService[]>([]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    socket?.emit(COMMANDS.GET_VENDORS, (payload: string[]) => {
      setVendors(payload.map((vendor) => new VendorService(vendor)));
      setIsLoading(false);
    });
  }, [socket]);

  useEffect(refresh, [refresh]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <context.Provider value={{ vendors, refresh, setVendors }}>
      {children}
    </context.Provider>
  );
}
