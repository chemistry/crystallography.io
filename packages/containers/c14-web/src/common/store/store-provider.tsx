import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import type { AppState, AppStore } from './create-app-store';
import { createAppStore } from './create-app-store';

const StoreContext = createContext<AppStore | null>(null);

export const StoreProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: Partial<AppState>;
}) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createAppStore(initialState);
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useAppStore = <T,>(selector: (state: AppState) => T): T => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useAppStore must be used within StoreProvider');
  }
  return useStore(store, selector);
};

export const useAppStoreApi = (): AppStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useAppStoreApi must be used within StoreProvider');
  }
  return store;
};
