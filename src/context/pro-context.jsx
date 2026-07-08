"use client";

import * as React from "react";

const ProContext = React.createContext(undefined);

export function ProProvider({ children, initialIsPro = false, initialName = null }) {
  const value = React.useMemo(
    () => ({ isPro: initialIsPro, name: initialName }),
    [initialIsPro, initialName],
  );

  return <ProContext.Provider value={value}>{children}</ProContext.Provider>;
}

export function useProStatus() {
  const context = React.useContext(ProContext);
  if (context === undefined) {
    throw new Error("useProStatus must be used within a ProProvider");
  }
  return context;
}