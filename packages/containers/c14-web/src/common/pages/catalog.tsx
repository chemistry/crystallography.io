import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Loader } from "../components/loader";
import { Pagination } from "../components/pagination";
import { RootState } from "../store";
import { StructuresList } from "../components/structure-list/structure-list";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./catalog.scss");
}

export const CatalogPage = () => {

    const { page } = useParams() as any;
    let currentPage = parseInt(page, 10);
    currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;

    const isLoading = useSelector((state: RootState) => state.catalogPage.isLoading);
    const pages = useSelector((state: RootState)=> state.catalogPage.meta.pages);
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
                        <Pagination currentPage={currentPage} maxPages={10} totalPages={pages} url={'/catalog'} />
                        <StructuresList list={structures} />
                    </Loader>
                </div>
            </div>
        </div>
    );
};
