import * as React from "react";
import { SearchTab } from "../../components";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./search-main.scss");
}

export const SearchByAuthorsPage = () => {
    return (
        <div className="search-layout-tabs">
            <header className="app-layout-header">
                <h2 className="text-primary">Crystal Structure Search</h2>
                <SearchTab />
            </header>
            <div className="app-layout-content">
                <h2>Search By Authors</h2>
            </div>
        </div>
    );
}
