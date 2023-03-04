import React from 'react';

type Context = {
  isOpen: (_: string) => boolean;
  open: (_: string, _s?: any) => void;
  close: (_: string) => void;
  getState: (_: string) => any;
  setState: (_: string, _s: any) => void;
};

export const context = React.createContext<Context>({
  isOpen: () => false,
  open: () => {},
  close: () => {},
  getState: () => {},
  setState: () => {},
});

export function useModal(modalName: string) {
  const { isOpen, open, close, getState, setState } = React.useContext(context);

  return {
    open: (state?: any) => open(modalName, state),
    close: () => close(modalName),
    isOpen: () => isOpen(modalName),
    getState: () => getState(modalName),
    setState: (state: any) => setState(modalName, state),
  };
}

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [openState, setOpenState] = React.useState<Record<string, boolean>>({});
  const [states, setStates] = React.useState<Record<string, any>>({});

  const open = (modalName: string, state: any) => {
    setOpenState((prevState) => ({
      ...prevState,
      [modalName]: true,
    }));

    setState(modalName, state);
  };

  const close = (modalName: string) => {
    setOpenState((prevState) => ({
      ...prevState,
      [modalName]: false,
    }));
  };

  const isOpen = (modalName: string) => {
    return openState[modalName] || false;
  };

  const getState = (modalName: string) => {
    return states[modalName] || {};
  };

  const setState = (modalName: string, state: any) => {
    setStates((prevState) => ({
      ...prevState,
      [modalName]: state,
    }));
  };

  return (
    <context.Provider value={{ isOpen, open, close, getState, setState }}>
      {children}
    </context.Provider>
  );
}
