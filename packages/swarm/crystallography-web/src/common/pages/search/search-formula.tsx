import * as React from "react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, NoSearchResults, Pagination, SearchTab } from "../../components";
import { Input } from "../../components/input";
import { StructuresList } from "../../components/structure-list/structure-list";
import { useGaAnalytics } from "../../hooks/useAnalytics";
import { RootState } from "../../store";
import { SearchState, searchStructureByFormula } from "../../store/search-by-formula-page.slice";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./search-main.scss");
}

interface SearchFormData {
    formula: string;
}

const SearchByFormulaForm = ({ onSubmit, initialValue }: { initialValue: string, onSubmit: (data: SearchFormData) => void })=> {

    const [value, setValue] = useState(initialValue);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        if (!!value) {
            onSubmit({ formula: value });
        }
    }
    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>)=> {
        setValue(event.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="has-icon-left has-button-right">
                    <i className="form-icon icon icon-search search-layout__search-icon"></i>
                    <div className="c-form-input">
                        <input
                            type="text"
                            className="form-input"
                            name="formula"
                            autoComplete="off"
                            value={value}
                            onChange={onValueChange} />
                    </div>
                    <button className="form-button btn">Search</button>
                </div>
            </div>
        </form>
    );
}


const SearchSummary = ({ totalResults }: {totalResults: number })=> {
    return (
        <div className="search-layout__results-header">
            <h4 className="text-primary">Results: {totalResults}</h4>
        </div>
    )
}


const SearchResults = ()=> {
    const dispatch = useDispatch();
    const containerRef = useRef(null);
    const isLoading = useSelector((state: RootState) => state.searchByFormulaSlice.isLoading);
    const structures = useSelector((state: RootState) => {
        const structuresIds = state.searchByFormulaSlice.data.structureIds;
        const structuresById: any = state.searchByFormulaSlice.data.structureById;

        return structuresIds.map((id) => {
            return structuresById[id];
        }).filter((item) => !!item);
    });
    const currentPage = useSelector((state: RootState) => state.searchByFormulaSlice.currentPage);
    const totalPages = useSelector((state: RootState) => state.searchByFormulaSlice.meta.totalPages);
    const hasNoResults = useSelector((state: RootState) => {
        const status = state.searchByFormulaSlice.status;
        const resultCount = Object.keys(state.searchByFormulaSlice.data.structureById).length;
        return (status === SearchState.success && resultCount === 0);
    });
    const totalResults = useSelector((state: RootState) =>{
        return Math.max(
            Object.keys(state.searchByFormulaSlice.data.structureById).length,
            state.searchByFormulaSlice.meta.totalResults
        );
    });
    const searchString = useSelector((state: RootState) => state.searchByFormulaSlice.meta.searchString);

    const showSummary = useSelector((state: RootState) => {
        const status = state.searchByFormulaSlice.status;
        const resultCount = Math.max(
            Object.keys(state.searchByFormulaSlice.data.structureById).length,
            state.searchByAuthorSlice.meta.totalResults
        );

        return resultCount !== 0 && [SearchState.processing, SearchState.started, SearchState.success].includes(status);
    });

    const onPageNavigate = (page: number) => {
        dispatch(searchStructureByFormula({
            formula: searchString,
            page
        }));
    }

    return (
        <div>
            <div className="search-layout__results-list">
                <div ref={containerRef}>
                    { showSummary ? <SearchSummary totalResults={totalResults}/> : null }
                    { hasNoResults ? <NoSearchResults /> : null }
                    <Loader isVisible={isLoading} scrollElement={containerRef}>
                        <Pagination
                            currentPage={currentPage}
                            maxPages={10}
                            totalPages={totalPages}
                            url='/search'
                            onPageNavigate={onPageNavigate}
                        />
                        <StructuresList list={structures} />
                    </Loader>
                </div>
            </div>
        </div>
    )
}

export const SearchByFormulaPage = () => {

    const dispatch = useDispatch();
    const currentPage = useSelector((state: RootState) => state.searchByFormulaSlice.currentPage);
    const gaEvent  = useGaAnalytics();

    const handleSubmit = (data: SearchFormData) => {
        gaEvent({
            category: 'Search',
            action: 'Search:Formula',
        });
        dispatch(searchStructureByFormula({
            ...data, page: currentPage
        }));
    }
    const searchString = useSelector((state: RootState) => state.searchByFormulaSlice.meta.searchString);

    return (
        <div className="search-layout-tabs">
            <header className="app-layout-header">
                  <h2 className="text-primary">Crystal Structure Search</h2>
                  <SearchTab />
            </header>
            <div className="app-layout-content">
                <div className="search-layout__page">
                    <div>
                        <SearchByFormulaForm onSubmit={handleSubmit} initialValue={searchString}/>
                    </div>
                    <div>
                        <SearchResults />
                    </div>
                </div>
            </div>
        </div>
    );
}
