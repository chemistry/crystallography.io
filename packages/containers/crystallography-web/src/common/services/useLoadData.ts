import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

let IS_FIRST_MOUNT_AFTER_LOAD = true;

const isStoreDataMissed = () => {
    if (typeof window === "undefined") {
        return false;
    }

    return (
        !(window as any).__INITIAL_STATE__ ||
        Object.keys((window as any).__INITIAL_STATE__).length === 0
    );
};

export const useInBrowser = (effect: React.EffectCallback, deps?: React.DependencyList) => {
    if (typeof window === "undefined") {
        useEffect(effect, deps);
    }
}

export const useLoadedData = (route: any) => {

    const dispatch = useDispatch();
    const params = useParams();

    const fetchData = () => {
        if (route && route.loadData ) {
            route.loadData(dispatch, params);
        }
    };

    useEffect(() => {
        if (!IS_FIRST_MOUNT_AFTER_LOAD || isStoreDataMissed()) {
            fetchData();
        }
        IS_FIRST_MOUNT_AFTER_LOAD = false;

    }, [...Object.keys(params), ...Object.values(params)]);
};
