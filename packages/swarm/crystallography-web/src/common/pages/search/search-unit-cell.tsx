import * as React from "react";
import { SearchTab } from "../../components";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./search-main.scss");
}

const SearchByUnitCellForm = ({ onSubmit }: any) => {
    return (
        <div className="search-layout__search_form">
            <div className="columns">
                    <div className="column col-4">
                        <label className="form-label">a</label>
                        <input type="text" className="form-input" name="name" autoComplete="off" value=""></input>
                    </div>
                    <div className="column col-4">
                        <label className="form-label">α</label>
                        <input type="text" className="form-input" name="name" autoComplete="off" value="90"></input>
                    </div>
            </div>
            <div className="columns">
                <div className="column col-4">
                    <label className="form-label">b</label>
                    <input type="text" className="form-input" name="name" autoComplete="off" value=""></input>
                </div>
                <div className="column col-4">
                    <label className="form-label">β</label>
                    <input type="text" className="form-input" name="name" autoComplete="off" value="90"></input>
                </div>
            </div>
            <div className="columns">
                <div className="column col-4">
                    <label className="form-label">c</label>
                    <input type="text" className="form-input" name="name" autoComplete="off" value=""></input>
                </div>
                <div className="column col-4">
                    <label className="form-label">γ</label>
                    <input type="text" className="form-input" name="name" autoComplete="off" value="90"></input>
                </div>
            </div>

            <div className="columns">
                <div className="column col-8">
                    <label className="form-label">tolerance (%)</label>
                    <input type="text" className="form-input" name="name" autoComplete="off" value="1.5"></input>
                </div>
            </div>

            <div className="columns search-layout__search_row">
                <div className="column col-4">
                    <button className="btn btn-active input-inline search-layout__search_btn">Search</button>
                </div>
            </div>
        </div>
    )
}

export const SearchByUnitCellPage = (): JSX.Element => {

    const handleSubmit = (/* data: SearchFormData */) => {
        // tslint:disable-next-line
        console.log('-----------------');
    }

    return (
        <div className="search-layout-tabs">
            <header className="app-layout-header">
                  <h2 className="text-primary">Crystal Structure Search</h2>
                  <SearchTab />
            </header>
            <div className="app-layout-content">
                <SearchByUnitCellForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
