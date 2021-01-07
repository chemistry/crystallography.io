import { DependencyList, EffectCallback, useEffect } from 'react';

export const useBrowserEffect = (callBack: EffectCallback, deps? : DependencyList) => {

    // skip in SSR
    if (!process.env.BROWSER) {
        return;
    }

    return useEffect(callBack, deps);
};

