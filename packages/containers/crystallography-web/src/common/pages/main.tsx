import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteConfig } from "react-router-config";
import { useLoadedData } from "../services";
import { RootState } from "../store";

export const MainPage = (props: { route: RouteConfig }) => {
  const structures = useSelector((state: RootState) => state.structures);

  useLoadedData(props.route);

  return (<div>
      <h1>Messages</h1>
      <hr/>
      <pre>{JSON.stringify(structures, null, 4)}</pre>
  </div>);
};
