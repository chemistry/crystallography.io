import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RouteConfig } from "react-router-config";
import { NavLink, useParams } from "react-router-dom";

import { useLayoutEffect } from "react";
import { useCallback } from "react";
import { Loader } from "../components/loader";
import { Pagination } from "../components/pagination";
import { StructureModel } from "../models";
import { useLoadedData } from "../services";
import { RootState } from "../store";
import { CompoundFormula, CompoundName } from "../utils";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./catalog.scss");
}

const StructuresList = ({ list }: { list: StructureModel[]}) => {
    return (
        <div className="c-structure-list">{
            list.map((item) => {
                return (
                    <div className="c-structure-list-item" key={item.id}>
                        <h2  className="c-structure-list-item__name">
                            <CompoundName model={item} />
                        </h2>
                        <p className="c-structure-list-item__formula">
                            <CompoundFormula model={item} />
                        </p>
                        <p className="c-structure-list-item__journal">{
                            item.articleHtml ? (<span dangerouslySetInnerHTML={{__html: item.articleHtml}} />) : ""
                        }</p>
                        <p className="c-structure-list-item__unit-cell">
                            <b>a</b>={item.a}Å&nbsp;&nbsp;&nbsp;<b>b</b>={item.b}Å&nbsp;&nbsp;&nbsp;<b>c</b>={item.c}Å
                        </p>
                        <p className="c-structure-list-item__unit-cell">
                            <b>α</b>={item.alpha}°&nbsp;&nbsp;&nbsp;<b>β</b>={item.beta}°&nbsp;&nbsp;&nbsp;<b>γ</b>={item.gamma}°
                        </p>
                    </div>
                );
            })
        }</div>
    );
};

export const CatalogPage = (props: { route: RouteConfig }) => {
    // Page Navigation
    useLoadedData(props.route);

    const { page } = useParams();
    let currentPage = parseInt(page, 10);
    currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;

    const isLoading = useSelector((state: RootState) => state.catalogPage.isLoading);
    const containerRef = useRef(null);

    const structures = useSelector((state: RootState) => {
        const structuresIds = state.catalogPage.data.structureIds;
        const structuresById: any = state.catalogPage.data.structureById;

        return structuresIds.map((id) => {
            return structuresById[id];
        }).filter((item) => !!item);
    });

    return (
        <div>
            <header className="app-layout-header">
                <h2 className="text-primary">Catalog</h2>
            </header>
            <div className="app-layout-content" ref={containerRef}>
                <div className="app-layout-page-transparent">
                    <Loader isVisible={isLoading} scrollElement={containerRef}>
                        <Pagination currentPage={currentPage} maxPages={10} totalPages={4000} />
                        <StructuresList list={structures} />
                    </Loader>
                </div>
            </div>
        </div>
    );
};
