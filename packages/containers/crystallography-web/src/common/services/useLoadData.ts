import { useEffect } from "react";
import { useDispatch } from "react-redux";

let IS_FIRST_MOUNT_AFTER_LOAD = true;

export const useLoadedData = (route: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
      if (IS_FIRST_MOUNT_AFTER_LOAD) {
          IS_FIRST_MOUNT_AFTER_LOAD = false;
          return;
      }
      if (route && route.loadData ) {
          route.loadData(dispatch);
      }
  }, []);
};
