"use client";

import { createContext, useCallback, useContext, useMemo, useRef } from "react";

const CarDetectionContext = createContext(null);

export function CarDetectionProvider({ children }) {
  const registryRef = useRef(new Map());

  const register = useCallback((handle, data) => {
    if (!handle) return;
    registryRef.current.set(handle, data);
  }, []);

  const unregister = useCallback((handle) => {
    if (!handle) return;
    registryRef.current.delete(handle);
  }, []);

  const getByHandle = useCallback(
    (handle) => registryRef.current.get(handle),
    []
  );

  const hasHandle = useCallback(
    (handle) => registryRef.current.has(handle),
    []
  );

  const value = useMemo(
    () => ({
      register,
      unregister,
      getByHandle,
      hasHandle,
      getEntries: () => Array.from(registryRef.current.values()),
    }),
    [getByHandle, hasHandle, register, unregister]
  );

  return (
    <CarDetectionContext.Provider value={value}>
      {children}
    </CarDetectionContext.Provider>
  );
}

export function useCarRegistry() {
  const ctx = useContext(CarDetectionContext);
  if (!ctx) {
    throw new Error("useCarRegistry must be used within CarDetectionProvider");
  }
  return ctx;
}

