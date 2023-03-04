import React from 'react';

export type Context = {
  showHiddenVendors: boolean;
  toggleShowHiddenVendors: () => void;
};

export const context = React.createContext<Context>({
  showHiddenVendors: false,
  toggleShowHiddenVendors: () => {},
});

export const useFilters = () => React.useContext(context);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [showHiddenVendors, setShowHiddenVendors] = React.useState(false);

  const toggleShowHiddenVendors = () => {
    setShowHiddenVendors(!showHiddenVendors);
  };

  return (
    <context.Provider
      value={{
        showHiddenVendors,
        toggleShowHiddenVendors,
      }}
    >
      {children}
    </context.Provider>
  );
}
