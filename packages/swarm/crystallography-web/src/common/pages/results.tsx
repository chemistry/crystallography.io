import * as React from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { RouteConfig } from "react-router-config";
import { RootState } from "../store";
import { Loader, Pagination } from "../components";
import { StructuresList } from "../components/structure-list/structure-list";
import { useBrowserEffect } from "../hooks";
import { useLoadedData } from "../services";
import { closeWSSubscription, subscribeToWSUpdates } from "../store/store.wsMiddleware";


const parsePage = (page?: string): number => {
    let currentPage = parseInt(page, 10);
    currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;
    return currentPage;
}
const numberWithSpaces = (x: number): string => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const MAX_PAGES = 10;
export const SearchResultsPage  = (props: { route: RouteConfig })=> {
    // Page Navigation
    useLoadedData(props.route);

    const dispatch = useDispatch();
    const { id, page } = useParams() as any;
    const isLoading = useSelector((state: RootState) => state.searchResults.isLoading);
    const pages = useSelector((state: RootState)=> state.searchResults.meta.pagesAvailable);
    const progress = useSelector((state: RootState) => state.searchResults.meta.progress);
    const found = useSelector((state: RootState) => state.searchResults.meta.found);
    const currentPage = parsePage(page);
    const containerRef = useRef(null);

    const structures = useSelector((state: RootState) => {
        const structuresIds = state.searchResults.data.structureIds;
        const structuresById: any = state.searchResults.data.structureById;

        return structuresIds.map((structureId) => {
            return structuresById[structureId];
        }).filter((item) => !!item);
    });

    useBrowserEffect(()=> {
        dispatch(subscribeToWSUpdates());

        return ()=> {
            dispatch(closeWSSubscription());
        }
    }, [id, page]);

    return (
        <div>
            <header className="app-layout-header">
                <h2 className="text-primary">Results</h2>
            </header>
            <div className="app-layout-content" ref={containerRef}>
                <div className="app-layout-page-transparent">
                    <Loader isVisible={isLoading} scrollElement={containerRef}>
                        <div className="bar bar-sm">
                            <div className="bar-item" role="progressbar" style={{'width': `${progress}%`}} >{`${progress}%`}</div>
                        </div>
                        <div className="columns">
                            <div className="column col-10">
                                <h4 className="text-primary">{`Total Results: ${numberWithSpaces(found)}`}</h4>
                            </div>
                        </div>
                        <Pagination currentPage={currentPage} maxPages={MAX_PAGES} totalPages={pages} url={`/results/${id}`} />
                        <StructuresList list={structures} />
                    </Loader>
                </div>
            </div>
        </div>
    );
}
