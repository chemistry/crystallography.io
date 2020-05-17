import React from "react";
import { useSelector } from "react-redux";
import { RouteConfig } from "react-router-config";
import { NavLink } from "react-router-dom";

import { useLoadedData } from "../services";
import { RootState } from "../store";

export const CatalogPage = (props: { route: RouteConfig }) => {
  // Page Navigation
  const structures = useSelector((state: RootState) => state.structures);
  useLoadedData(props.route);

  return (<div>
      <h1>Catalog</h1>
      <hr/>
      <ul>
        <li><NavLink to="/catalog/1">1</NavLink></li>
        <li><NavLink to="/catalog/2">2</NavLink></li>
      </ul>

      <pre>{JSON.stringify(structures, null, 4)}</pre>
  </div>);
};
