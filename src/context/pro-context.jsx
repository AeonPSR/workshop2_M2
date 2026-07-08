"use client";

import * as React from "react";

const STORAGE_KEY = "isPro";

const ProContext = React.createContext(undefined);

export function ProProvider({ children }) {
  const [isPro, setIsPro] = React.useState(false);

  React.useEffect(() => {
    setIsPro(window.localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(isPro));
  }, [isPro]);

  const value = React.useMemo(() => ({ isPro, setIsPro }), [isPro]);

  return <ProContext.Provider value={value}>{children}</ProContext.Provider>;
}

export function useProStatus() {
  const context = React.useContext(ProContext);
  if (context === undefined) {
    throw new Error("useProStatus must be used within a ProProvider");
  }
  return context;
}
