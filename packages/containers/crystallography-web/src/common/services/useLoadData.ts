import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// let IS_FIRST_MOUNT_AFTER_LOAD = false;
// if (IS_FIRST_MOUNT_AFTER_LOAD) {
//     IS_FIRST_MOUNT_AFTER_LOAD = false;
//     return;
// }

export const useLoadedData = (route: any) => {
  const dispatch = useDispatch();
  const { page } = useParams();

  const fetchData = () => {
    if (route && route.loadData ) {
        route.loadData(dispatch, { page });
    }
  };
  useEffect(() => {
      fetchData();
  }, [page]);
};