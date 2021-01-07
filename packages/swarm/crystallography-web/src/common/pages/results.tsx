import * as React from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RouteConfig } from "react-router-config";
import { Loader, Pagination } from "../components";
import { StructuresList } from "../components/structure-list/structure-list";
import { useLoadedData } from "../services";
import { RootState } from "../store";


const parsePage = (page?: string): number => {
    let currentPage = parseInt(page, 10);
    currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;
    return currentPage;
}

const MAX_PAGES = 10;

export const SearchResultsPage  = (props: { route: RouteConfig })=> {
    // Page Navigation
    useLoadedData(props.route);

    const { id, page } = useParams() as any;
    const isLoading = useSelector((state: RootState) => state.searchResults.isLoading);
    const pages = useSelector((state: RootState)=> state.searchResults.meta.pagesAvailable);
    const currentPage = parsePage(page);
    const containerRef = useRef(null);

    const structures = useSelector((state: RootState) => {
        const structuresIds = state.searchResults.data.structureIds;
        const structuresById: any = state.searchResults.data.structureById;

        return structuresIds.map((structureId) => {
            return structuresById[structureId];
        }).filter((item) => !!item);
    });

    return (
        <div>
            <header className="app-layout-header">
                <h2 className="text-primary">Results</h2>
            </header>
            <div className="app-layout-content" ref={containerRef}>
                <div className="app-layout-page-transparent">
                    <Loader isVisible={isLoading} scrollElement={containerRef}>
                        <Pagination currentPage={currentPage} maxPages={MAX_PAGES} totalPages={pages} url={`/results/${id}`} />
                        <StructuresList list={structures} />
                    </Loader>
                </div>
            </div>
        </div>
    );
}
