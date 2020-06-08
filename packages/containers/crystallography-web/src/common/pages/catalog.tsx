import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RouteConfig } from "react-router-config";
import { NavLink } from "react-router-dom";

import { useLayoutEffect } from "react";
import { useCallback } from "react";
import { Loader } from "../components/loader";
import { useLoadedData } from "../services";
import { RootState } from "../store";

export const CatalogPage = (props: { route: RouteConfig }) => {
  // Page Navigation
  const structures = useSelector((state: RootState) => state.catalogPage);
  useLoadedData(props.route);

  const isLoading = useSelector((state: RootState) => state.catalogPage.isLoading);
  const containerRef = useRef(null);

  return (
        <div>
            <header className="app-layout-header">
                <h2 className="text-primary">Catalog</h2>
            </header>
            <div className="app-layout-content" id="content" ref={containerRef}>
                <Loader isVisible={isLoading} scrollElement={containerRef}>
                    <ul>
                    <li><NavLink to="/catalog/1">1</NavLink></li>
                    <li><NavLink to="/catalog/2">2</NavLink></li>
                    </ul>
                    <hr />
                    <pre>{JSON.stringify(structures, null, 4)}</pre>
                </Loader>
            </div>
        </div>
    );
};
