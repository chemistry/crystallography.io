import type { EffectCallback, DependencyList } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStoreApi } from '../store';
import type { RouteDefinition } from '../index';

let IS_FIRST_MOUNT_AFTER_LOAD = true;

const isStoreDataMissed = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    !(window as any).__INITIAL_STATE__ ||
    Object.keys((window as any).__INITIAL_STATE__).length === 0
  );
};

export const useInBrowser = (effect: EffectCallback, deps?: DependencyList) => {
  if (typeof window !== 'undefined') {
    useEffect(effect, deps);
  }
};

export const useLoadedData = (route: RouteDefinition) => {
  const store = useAppStoreApi();
  const params = useParams();

  const fetchData = () => {
    if (route?.loadData) {
      route.loadData(store, params);
    }
  };

  useEffect(() => {
    if (!IS_FIRST_MOUNT_AFTER_LOAD || isStoreDataMissed()) {
      fetchData();
    }
    IS_FIRST_MOUNT_AFTER_LOAD = false;
  }, [...Object.keys(params), ...Object.values(params)]);
};
