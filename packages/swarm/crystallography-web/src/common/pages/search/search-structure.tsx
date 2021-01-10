import * as React from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { SearchTab } from "../../components";
import { useGaAnalytics } from "../../hooks/useAnalytics";
import { searchStructureByStructure } from "../../store/search-by-structure.slice";

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
    const molpadRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const gaEvent =  useGaAnalytics();

    const handleSubmit = async () => {
        if (MolPad && molpadRef && molpadRef.current) {
            const molpad = molpadRef.current;
            const validationMessage = molpad.isSutableForSearch();
            if (validationMessage !== '') {
                return alert(validationMessage);
            }
            const jmol = molpad.getJmol();
            gaEvent({
                category: 'Search',
                action: 'Search:Structure',
            });
            const searchId = await dispatch(searchStructureByStructure({
                molecule: jmol,
            }));
            if (searchId) {
                history.push(`/results/${searchId}/1`);
            }
        }
    }

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
                            (MolPad) ? (<MolPad ref={molpadRef} />) : null
                        }
                    </div>
                    <div className="search-layout__search_row">
                        <div className="column col-6">
                            <p className="text-gray">Search will be performed considering all bonds order as "any"</p>
                        </div>
                    </div>
                    <div>
                        <div className="column col-6">
                            <button className="btn btn-active input-inline search-layout__search_btn" onClick={handleSubmit}>Search</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
