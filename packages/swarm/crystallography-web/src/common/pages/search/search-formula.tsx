import * as React from "react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, NoSearchResults, Pagination, SearchTab } from "../../components";
import { Input } from "../../components/input";
import { StructuresList } from "../../components/structure-list/structure-list";
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
        if (value !== '') {
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

export const SearchByFormulaPage = () => {

    const dispatch = useDispatch();
    const currentPage = useSelector((state: RootState) => state.searchByFormulaSlice.currentPage);

    const handleSubmit = (data: SearchFormData) => {
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
                    </div>
                </div>
            </div>
        </div>
    );
}
