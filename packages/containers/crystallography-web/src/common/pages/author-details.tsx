import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Pagination } from "../components";
import { Loader } from "../components/loader";
import { StructuresList } from "../components/structure-list/structure-list";
import { RootState } from "../store";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./catalog.scss");
}

const numberWithSpaces = (x: number): string => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const MAX_PAGES = 10;
export const AuthorDetailsPage = () => {

    const { page, name } = useParams() as any;
    let currentPage = parseInt(page, 10);
    currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;

    const found = useSelector((state: RootState) => state.authorsDetailsPage.meta.total);
    const isLoading = useSelector((state: RootState) => state.authorsDetailsPage.isLoading);
    const pages = useSelector((state: RootState)=> state.authorsDetailsPage.meta.pages);
    const structures = useSelector((state: RootState) => {
        const structuresIds = state.authorsDetailsPage.data.structureIds;
        const structuresById: any = state.authorsDetailsPage.data.structureById;

        return structuresIds.map((structureId) => {
            return structuresById[structureId];
        }).filter((item) => !!item);
    });


    const containerRef = useRef(null);

    return (
        <div>
            <header className="app-layout-header">
                <h2 className="text-primary">Structures by: {name}</h2>
            </header>
            <div className="app-layout-content" ref={containerRef}>
                <div className="app-layout-page-transparent">
                    <div className="columns">
                            <div className="column col-10">
                                <h4 className="text-primary">{`Total: ${numberWithSpaces(found)}`}</h4>
                            </div>
                    </div>
                    <Loader isVisible={isLoading} scrollElement={containerRef}>
                        <Pagination currentPage={currentPage} maxPages={MAX_PAGES} totalPages={pages} url={`/author/${name}`} />
                        <StructuresList list={structures} />
                    </Loader>
                </div>
            </div>
        </div>
    );
};
