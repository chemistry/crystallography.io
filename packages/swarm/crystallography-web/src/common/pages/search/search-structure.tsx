import * as React from "react";
import { SearchTab } from "../../components";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./search-main.scss");
}

let MolPad: any = null;
if (process.env.BROWSER) {
    // tslint:disable-next-line
    MolPad = require('@chemistry/molpad').MolPad;
}

export const SearchByStructurePage = () => {

    return (
        <div className="search-layout-tabs">
            <header className="app-layout-header">
                  <h2 className="text-primary">Crystal Structure Search</h2>
                  <SearchTab />
            </header>
            <div className="app-layout-content">
                <div className="search-layout__page">
                    <div className="search-layout__molpad-editor">
                        {
                            (MolPad) ? (<MolPad />) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
