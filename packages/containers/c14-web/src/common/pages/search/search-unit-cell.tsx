import * as React from "react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, NoSearchResults, Pagination, SearchTab } from "../../components";
import { StructuresList } from "../../components/structure-list/structure-list";
import { useGaAnalytics } from "../../hooks/useAnalytics";
import { RootState } from "../../store";
import { searchByUnitCell, SearchState } from "../../store/search-by-unit-cell-page.slice";
import { useValidationError } from "./common";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./search-main.scss");
}
// param Validation
const getPramsValidators = (param: string)=> {
    return [{
        type: 'required',
        isValid(value: string) {
            return (value !== '');
        },
        message: `Param ${param} can not be empty`,
    }, {
        type: 'number',
        isValid(value: string) {
            return !isNaN(parseFloat(value));
        },
        message: `Param ${param} should be a valid number`,
    }, {
        type: 'range',
        isValid(value: string) {
            const v = parseFloat(value);
            return (v > 0 && v < 1000);
        },
        message: `Param ${param} should be in range 0...1000`,
    }];
}

// angle Validation
const getAngleValidators = (param: string)=> {
    return [{
        type: 'required',
        isValid(value: string) {
            return (value !== '');
        },
        message: `Param ${param} can not be empty`,
    }, {
        type: 'number',
        isValid(value: string) {
            return !isNaN(parseFloat(value));
        },
        message: `Param ${param} should be a valid number`,
    }, {
        type: 'range',
        isValid(value: string) {
            const v = parseFloat(value);
            return (v > 2 && v < 180);
        },
        message: `Param ${param} should be in range 2...180`,
    }];
}

const toleranceValidators = [{
    type: 'required',
    isValid(value: string) {
        return (value !== '');
    },
    message: 'Param tolerance can not be empty',
}, {
    type: 'number',
    isValid(value: string) {
        return !isNaN(parseFloat(value));
    },
    message: 'Param tolerance should be a valid number',
}, {
    type: 'range',
    isValid(value: string) {
        const v = parseFloat(value);
        return (v > 0 && v < 100);
    },
    message: 'Param tolerance should be in range 0...100',
}];

const SearchByUnitCellForm = ({ onSubmit }: any) => {
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [c, setC] = useState('');
    const [alpha, setAlpha] = useState('90.0');
    const [beta, setBeta] = useState('90.0');
    const [gamma, setGamma] = useState('90.0');
    const [tolerance, setTolerance] = useState('1.5');
    const gaEvent =  useGaAnalytics();

    const aError = useValidationError(getPramsValidators('a'), a);
    const bError = useValidationError(getPramsValidators('b'), b);
    const cError = useValidationError(getPramsValidators('c'), c);

    const alphaError = useValidationError(getPramsValidators('alpha'), alpha);
    const betaError = useValidationError(getPramsValidators('beta'), beta);
    const gammaError = useValidationError(getPramsValidators('gamma'), gamma);
    const toleranceError = useValidationError(toleranceValidators, tolerance);

    const error = aError || bError || cError || alphaError || betaError || gammaError || toleranceError;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        gaEvent({
            category: 'Search',
            action: 'Search:Structure',
        });
        onSubmit({ a, b, c, alpha, beta, gamma, tolerance });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="search-layout__search_form">
                <div className="columns">
                        <div className="column col-6">
                            <label className="form-label">a</label>
                            <input
                                type="text"
                                className="form-input"
                                name="name"
                                autoComplete="off"
                                onChange={(e)=> { setA(e.target.value);}}
                                value={a}></input>
                        </div>
                        <div className="column col-6">
                            <label className="form-label">α</label>
                            <input
                            type="text"
                            className="form-input"
                            name="name"
                            autoComplete="off"
                            onChange={(e)=> { setAlpha(e.target.value)}}
                            value={alpha}></input>
                        </div>
                </div>
                <div className="columns">
                    <div className="column col-6">
                        <label className="form-label">b</label>
                        <input
                        type="text"
                        className="form-input"
                        name="name"
                        autoComplete="off"
                        onChange={(e)=> { setB(e.target.value)}}
                        value={b}></input>
                    </div>
                    <div className="column col-6">
                        <label className="form-label">β</label>
                        <input
                        type="text"
                        className="form-input"
                        name="name"
                        autoComplete="off"
                        value={beta}
                        onChange={(e)=> { setBeta(e.target.value)}}
                        ></input>
                    </div>
                </div>
                <div className="columns">
                    <div className="column col-6">
                        <label className="form-label">c</label>
                        <input
                            type="text"
                            className="form-input"
                            name="name"
                            autoComplete="off"
                            onChange={(e)=> { setC(e.target.value)}}
                            value={c}></input>
                    </div>
                    <div className="column col-6">
                        <label className="form-label">γ</label>
                        <input
                            type="text"
                            className="form-input"
                            name="name"
                            autoComplete="off"
                            value={gamma}
                            onChange={(e)=> { setGamma(e.target.value)}}
                        ></input>
                    </div>
                </div>

                <div className="columns">
                    <div className="column col-12">
                        <label className="form-label">tolerance (%)</label>
                        <input
                        type="text"
                        className="form-input"
                        name="tolerance"
                        autoComplete="off"
                        value={tolerance}
                        onChange={(e)=> { setTolerance(e.target.value);}}
                        ></input>
                    </div>
                </div>

                <div className="columns search-layout__search_row">
                    <div className="column col-6">
                        <button
                            className="btn btn-active input-inline search-layout__search_btn"
                            disabled={!!error} title={error}>Search</button>
                    </div>
                </div>
            </div>
        </form>
    )
}
interface SearchFormData {
    a: string;
    b: string;
    c: string;
    alpha: string;
    beta: string;
    gamma: string;
    tolerance: string;
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
    const isLoading = useSelector((state: RootState) => state.searchByUnitCellSlice.isLoading);
    const structures = useSelector((state: RootState) => {
        const structuresIds = state.searchByUnitCellSlice.data.structureIds;
        const structuresById: any = state.searchByUnitCellSlice.data.structureById;

        return structuresIds.map((id) => {
            return structuresById[id];
        }).filter((item) => !!item);
    });
    const currentPage = useSelector((state: RootState) => state.searchByUnitCellSlice.search.page);
    const totalPages = useSelector((state: RootState) => state.searchByUnitCellSlice.meta.totalPages);
    const hasNoResults = useSelector((state: RootState) => {
        const status = state.searchByUnitCellSlice.status;
        const resultCount = Object.keys(state.searchByUnitCellSlice.data.structureById).length;
        return (status === SearchState.success && resultCount === 0);
    });
    const totalResults = useSelector((state: RootState) => {
        return Math.max(
            Object.keys(state.searchByUnitCellSlice.data.structureById).length,
            state.searchByUnitCellSlice.meta.totalResults
        );
    });
    const search = useSelector((state: RootState) => state.searchByUnitCellSlice.search);

    const showSummary = useSelector((state: RootState) => {
        const status = state.searchByUnitCellSlice.status;
        const resultCount = Math.max(
            Object.keys(state.searchByUnitCellSlice.data.structureById).length,
            state.searchByUnitCellSlice.meta.totalResults
        );

        return resultCount !== 0 && [SearchState.processing, SearchState.started, SearchState.success].includes(status);
    });

    const onPageNavigate = (page: number) => {
        dispatch(searchByUnitCell({
            ...search,
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

export const SearchByUnitCellPage = (): JSX.Element => {

    const dispatch = useDispatch();
    const currentPage = useSelector((state: RootState) => state.searchByUnitCellSlice.search.page);

    const handleSubmit = (data: SearchFormData) => {
        // tslint:disable-next-line
        dispatch(searchByUnitCell({
            ...data, page: 1
        }));
    }

    return (
        <div className="search-layout-tabs">
            <header className="app-layout-header">
                  <h2 className="text-primary">Crystal Structure Search</h2>
                  <SearchTab />
            </header>
            <div className="app-layout-content">
                <div className="search-layout__page">
                    <div>
                        <SearchByUnitCellForm onSubmit={handleSubmit} />
                    </div>
                    <div>
                        <SearchResults />
                    </div>
                </div>
            </div>
        </div>
    );
}
