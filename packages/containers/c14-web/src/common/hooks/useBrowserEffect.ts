import { useEffect } from 'react';
import type { DependencyList, EffectCallback } from 'react';

export const useBrowserEffect = (callBack: EffectCallback, deps?: DependencyList) => {
  // skip in SSR
  if (!process.env.BROWSER) {
    return;
  }

  useEffect(callBack, deps);
};
