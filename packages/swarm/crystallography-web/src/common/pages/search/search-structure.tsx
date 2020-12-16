import * as React from "react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, Pagination, SearchTab } from "../../components";
import { Input } from "../../components/input";
import { StructuresList } from "../../components/structure-list/structure-list";
import { RootState } from "../../store";
import { SearchState, searchStructureByName } from "../../store/search-by-name-page.slice";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./search-main.scss");
}

interface SearchFormData {
    name: string;
}


const renderItemValue = (item: any, search: any) => {
    // escape special characters
    search = search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp('(^' + search.split(' ').join('|') + ')', 'gi');

    // If the data OK - return values
    if (item.value && item.count) {
        let valueWords = item.value.split(' ');
        valueWords = valueWords.map((word: any) => {
            return word.replace(re, '<b>$1</b>');
        });

        const html = valueWords.join(' ');
        return (
            <span>
                <span dangerouslySetInnerHTML={{ __html: html }} />
                <span className="comments">{item.count}</span>
            </span>
        );
    }
}

const autoCompleteSource = (value: any, response: any) => {

    fetch('/api/v1/autocomplete/name?name=' + encodeURIComponent(value), {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res)=> {
        return res.json();
    })
    .then((data)=> {
        if (data.data && Array.isArray(data.data)) {
            const responseData = data.data.map((item: any) => {
                return {
                    value: item.name,
                    count: item.count,
                };
            });
            response(value, responseData);
            return;
        }
        response(value, []);
    })
    .catch(()=> {
        response(value, []);
    });
}

const SearchByNameForm = ({ onSubmit, initialValue }: { initialValue: string, onSubmit: (data: SearchFormData) => void }) => {

    const [name, setName ] = useState(initialValue);

    const autoCompleteOptions = {
        minChars: 1,
        delay: 100,
        source: autoCompleteSource,
        renderItemValue,
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setName(event.target.value);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (name !== '') {
            onSubmit({ name });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="has-icon-left has-button-right">
                    <i className="form-icon icon icon-search search-layout__search-icon"></i>
                    <Input
                        initialValue={initialValue}
                        name="name"
                        onChange={handleNameChange}
                        placeholder="Enter keyword"
                        autoCompleteOptions={autoCompleteOptions}
                    />
                    <button className="form-button btn">Search</button>
                </div>
            </div>
        </form>
    )
}

const SearchSummary = ({ totalResults }: {totalResults: number })=> {
    return (
        <div className="search-layout__results-header">
            <h4 className="text-primary">Results: {totalResults}</h4>
        </div>
    )
}

const NoSearchResults = ()=> {
    return (
        <div className="search-layout__no-results">
            <h4 className="search-layout__no-results_text text-primary text-center">Sorry, No result found :(</h4>
            <div className="search-layout__no-results_icon" >
                <svg width="752" height="321" viewBox="0 0 752 321" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M618.93 6.57304C618.486 3.724 615.817 1.77832 612.957 2.22131C610.106 2.6643 608.158 5.33962 608.602 8.18866C609.349 13.0529 610.306 28.2883 605.046 34.412C603.907 35.741 602.534 36.5314 600.804 36.8528L601.282 7.84121C601.352 3.62846 597.952 0.171387 593.727 0.171387C589.485 0.171387 586.068 3.6632 586.173 7.90201L587.538 62.9632C585.729 62.6679 584.295 61.8774 583.121 60.505C577.862 54.3726 578.818 39.1459 579.566 34.2817C580.009 31.4326 578.062 28.766 575.21 28.3143C572.359 27.8714 569.69 29.817 569.238 32.6661C568.864 35.0634 565.839 56.3878 575.176 67.2889C578.383 71.0326 582.73 73.1607 587.798 73.4907L588.39 97.4557H599.795L600.621 47.389C605.577 47.0068 609.828 44.8874 612.983 41.2045C622.329 30.3035 619.303 8.97041 618.93 6.57304Z" fill="#FB9B2B"/>
                    <path d="M132.097 53.252C131.81 51.4366 130.115 50.1945 128.289 50.4811C126.472 50.7678 125.229 52.4703 125.516 54.2857C125.994 57.3866 126.603 67.0976 123.247 71.0064C122.517 71.8489 121.647 72.3614 120.543 72.5612L120.847 54.0685C120.891 51.3845 118.726 49.1782 116.031 49.1782C113.328 49.1782 111.154 51.4019 111.215 54.1119L112.084 89.2124C110.928 89.03 110.015 88.5176 109.268 87.6403C105.912 83.7315 106.521 74.0205 106.999 70.9195C107.286 69.1041 106.043 67.4016 104.226 67.115C102.409 66.8284 100.705 68.0705 100.418 69.8859C100.174 71.4146 98.2532 85.0084 104.2 91.9572C106.243 94.3459 109.016 95.701 112.25 95.9094L112.632 111.188H119.9L120.43 79.2669C123.595 79.0237 126.298 77.6773 128.306 75.3234C134.261 68.3745 132.34 54.7808 132.097 53.252Z" fill="#FB9B2B"/>
                    <path d="M376 320.168C583.659 320.168 752 263.309 752 193.168C752 123.028 583.659 66.1685 376 66.1685C168.341 66.1685 0 123.028 0 193.168C0 263.309 168.341 320.168 376 320.168Z" fill="url(#paint0_linear)"/>
                    <path d="M312.19 139.76H301.897C293.325 139.76 286.353 132.794 286.353 124.23C286.353 122.032 284.562 120.243 282.354 120.243H270.427C267.236 120.243 264.654 117.663 264.654 114.475C264.654 111.287 267.236 108.708 270.427 108.708H282.354C290.926 108.708 297.898 115.674 297.898 124.238C297.898 126.436 299.689 128.234 301.897 128.234H312.19C315.381 128.234 317.962 130.814 317.962 134.001C317.962 137.181 315.381 139.76 312.19 139.76Z" fill="#0C3C65"/>
                    <path d="M346.129 2.99756C315.441 2.98887 289.474 28.7432 288.726 59.2922C288.014 92.0127 288.492 124.325 293.908 156.672C296.498 169.536 299.776 181.949 303.949 194.404C305.696 199.321 311.355 203.299 316.328 203.299C316.693 203.299 316.867 203.299 317.232 203.299C322.205 203.299 324.404 199.399 322.448 194.561C321.118 191.26 322.805 188.611 326.082 188.654C329.36 188.698 333.046 191.399 334.463 194.665C336.54 199.451 342.53 203.29 347.494 203.29C347.859 203.29 348.033 203.29 348.398 203.29C353.371 203.29 355.24 199.529 352.954 194.821C351.397 191.607 352.936 189.028 356.214 189.071C359.491 189.115 363.334 191.755 364.977 194.926C367.385 199.573 373.705 203.29 378.669 203.29C379.034 203.29 379.208 203.29 379.573 203.29C384.546 203.29 386.084 199.659 383.476 195.091C381.694 191.972 383.076 189.445 386.354 189.497C389.631 189.54 393.63 192.12 395.499 195.195C398.238 199.712 404.88 203.29 409.852 203.29C410.035 203.29 410.122 203.29 410.304 203.29C415.52 203.29 416.798 199.616 413.729 194.952C406.914 183.642 402.063 172.533 398.359 159.895C391.04 126.766 394.1 94.0105 397.864 60.6124C401.567 29.2817 377.66 2.98887 346.129 2.99756Z" fill="#4285F4"/>
                    <path d="M299.567 70.6968C304.974 74.51 313.798 67.7436 309.512 52.6819C309.295 51.9349 308.208 51.7351 307.869 52.5603C303.949 61.9412 293.117 66.154 299.567 70.6968Z" fill="#0C3C65"/>
                    <path d="M324.013 49.329C317.545 52.0565 329.142 88.2427 347.155 76.8292C358.135 69.8716 348.233 63.0531 337.088 58.9185C330.325 56.4169 327.899 47.6874 324.013 49.329Z" fill="#0C3C65"/>
                    <path d="M320.927 101.228C325.642 101.228 329.464 95.6673 329.464 88.8074C329.464 81.9474 325.642 76.3862 320.927 76.3862C316.212 76.3862 312.39 81.9474 312.39 88.8074C312.39 95.6673 316.212 101.228 320.927 101.228Z" fill="#0C3C65"/>
                    <path d="M353.953 139.76H343.66C335.089 139.76 328.117 132.794 328.117 124.23C328.117 122.032 326.326 120.243 324.118 120.243H312.19C309 120.243 306.418 117.663 306.418 114.475C306.418 111.287 309 108.708 312.19 108.708H324.118C332.689 108.708 339.661 115.674 339.661 124.238C339.661 126.436 341.452 128.234 343.66 128.234H353.953C357.144 128.234 359.726 130.814 359.726 134.001C359.726 137.181 357.144 139.76 353.953 139.76Z" fill="#0C3C65"/>
                    <defs>
                    <linearGradient id="paint0_linear" x1="376" y1="66.1685" x2="376" y2="320.168" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#DCE6F5"/>
                    <stop offset="0.53125" stopColor="#DCE6F5" stopOpacity="0.578125"/>
                    <stop offset="1" stopColor="#DCE6F5" stopOpacity="0"/>
                    </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    )
}

const SearchResults = ()=> {
    const containerRef = useRef(null);
    const isLoading = useSelector((state: RootState) => state.searchByNameSlice.isLoading);
    const structures = useSelector((state: RootState) => {
        const structuresIds = state.searchByNameSlice.data.structureIds;
        const structuresById: any = state.searchByNameSlice.data.structureById;

        return structuresIds.map((id) => {
            return structuresById[id];
        }).filter((item) => !!item);
    });
    const currentPage = useSelector((state: RootState) => state.searchByNameSlice.currentPage);
    const totalPages = useSelector((state: RootState) => state.searchByNameSlice.meta.totalPages);
    const hasNoResults = useSelector((state: RootState) => {
        const status = state.searchByNameSlice.status;
        const resultCount = Object.keys(state.searchByNameSlice.data.structureById).length;
        return (status === SearchState.success && resultCount === 0);
    });
    const totalResults = useSelector((state: RootState) =>{
        return Math.max(
            Object.keys(state.searchByNameSlice.data.structureById).length,
            state.searchByNameSlice.meta.totalResults
        );
    })
    const showSummary = useSelector((state: RootState) => {
        const status = state.searchByNameSlice.status;
        const resultCount = Math.max(
            Object.keys(state.searchByNameSlice.data.structureById).length,
            state.searchByNameSlice.meta.totalResults
        );

        return resultCount !== 0 && [SearchState.processing, SearchState.started, SearchState.success].includes(status);
    });

    return (
        <div>
            <div className="search-layout__results-list">
                <div ref={containerRef}>
                    { showSummary ? <SearchSummary totalResults={totalResults}/> : null }
                    { hasNoResults ? <NoSearchResults /> : null }
                    <Loader isVisible={isLoading} scrollElement={containerRef}>
                        <Pagination currentPage={currentPage} maxPages={10} totalPages={totalPages} url={'/catalog'} />
                        <StructuresList list={structures} />
                    </Loader>
                </div>
            </div>
        </div>
    )
}

export const SearchByStructurePage = () => {

    const dispatch = useDispatch();

    const handleSubmit = (data: SearchFormData) => {
        dispatch(searchStructureByName(data));
    }
    const searchString = useSelector((state: RootState) => state.searchByNameSlice.meta.searchString);

    return (
        <div className="search-layout-tabs">
            <header className="app-layout-header">
                  <h2 className="text-primary">Crystal Structure Search</h2>
                  <SearchTab />
            </header>
            <div className="app-layout-content">
                <div className="search-layout__page">
                    <div>
                        <SearchByNameForm onSubmit={handleSubmit} initialValue={searchString}/>
                    </div>
                    <div>
                        <SearchResults />
                    </div>
                </div>
            </div>
        </div>
    );
}


export const DemoFormData = ()=> {
    return (
        <div>
<h2 className="text-primary">Badges</h2>
    <p><span className="text-primary p-1">primary color</span></p>
    <p><span className="text-secondary p-1">secondary color</span></p>
    <p><span className="text-additional p-1">additional color</span></p>
    <p><span className="text-dark p-1">dark color</span></p>
    <p><span className="text-gray p-1">gray color</span></p>
    <p><span className="text-light p-1">light color</span></p>
    <p><span className="text-active p-1">active color</span></p>
    <p><span className="text-success p-1">success color</span></p>
    <p><span className="text-warning p-1">warning color</span></p>
    <p><span className="text-error p-1">error color</span></p>

    <p><span className="bg-primary p-1">primary bg</span></p>
    <p><span className="bg-secondary p-1">secondary bg</span></p>
    <p><span className="bg-additional p-1">additional color</span></p>
    <p><span className="bg-dark p-1">dark bg</span></p>
    <p><span className="bg-default p-1">default bg</span></p>
    <p><span className="bg-active p-1">active bg</span></p>
    <p><span className="bg-success p-1">success bg</span></p>
    <p><span className="bg-warning p-1">warning bg</span></p>
    <p><span className="bg-error p-1">error bg</span></p>
    <hr/>

    <h3 className="text-primary">Form radio</h3>
    <div className="form-group">
        <label className="form-radio">
            <input type="radio" name="gender" checked />
            <i className="form-icon"></i> Male
        </label>
        <label className="form-radio">
            <input type="radio" name="gender" />
            <i className="form-icon"></i> Female
        </label>
    </div>
    < hr/>

    <h3 className="text-primary">Checkbox</h3>
    <div className="form-group">
        <label className="form-checkbox">
            <input type="checkbox" />
            <i className="form-icon"></i> Remember me
        </label>
    </div>
    < hr/>
    <h3 className="text-primary">Form switch</h3>
    <div className="form-group">
        <label className="form-switch">
            <input type="checkbox" />
            <i className="form-icon"></i> Send me emails with news and tips
        </label>
    </div>
    <hr/>
    <h3 className="text-primary">Disabled State</h3>

    <fieldset disabled>
    <div className="form-group">
    <label className="form-label">Name</label>
    <input className="form-input" type="text" id="input-example-19" placeholder="Name" />
    </div>
    <div className="form-group">
    <label className="form-label">Gender</label>
    <label className="form-radio">
    <input type="radio" name="gender" disabled />
    <i className="form-icon"></i> Male
    </label>
    <label className="form-radio">
    <input type="radio" name="gender" disabled />
    <i className="form-icon"></i> Female
    </label>
    </div>
    <div className="form-group">
    <select className="form-select" disabled >
    <option>Choose an option</option>
    <option>Slack</option>
    <option>Skype</option>
    <option>Hipchat</option>
    </select>
    </div>
    <div className="form-group">
    <label className="form-switch">
    <input type="checkbox" disabled />
    <i className="form-icon"></i> Send me emails with news and tips
    </label>
    </div>
    <div className="form-group">
    <label className="form-label">Message</label>
    <textarea className="form-input" id="input-example-20" placeholder="Textarea" disabled></textarea>
    </div>
    <div className="form-group">
    <label className="form-checkbox">
    <input type="checkbox" disabled />
    <i className="form-icon"></i> Remember me
    </label>
    </div>
    </fieldset>

    <hr />
    <h3 className="text-primary">Inputs</h3>

    <div className="form-group">
        <select className="form-select">
            <option>Choose an option</option>
            <option>Slack</option>
            <option>Skype</option>
            <option>Hipchat</option>
        </select>
    </div>

    <div className="form-group">
        <label className="form-label label-sm">Name</label>
        <input className="form-input" type="text" id="input-example-1" placeholder="Name" />
    </div>
    <div className="form-group">
         <label className="form-label label-sm">Message</label>
         <textarea className="form-input" id="input-example-3" placeholder="Textarea"></textarea>
    </div>

    <div className="form-group">
        <label className="form-label label-sm">Name</label>
        <input className="form-input is-success" type="text" id="input-example-1" placeholder="Name" />
        <div className="form-input-hint">The name is valid</div>
    </div>

    <div className="form-group has-error">
        <label className="form-label label-sm">Password</label>
        <input className="form-input" type="text" id="input-example-1" placeholder="Password" />
        <div className="form-input-hint">Passwords must have at least 8 characters.</div>
    </div>
    <hr />
    <br />
    <h3 className="text-primary">Inputs with icons</h3>
    <div className="form-group">
        <div className="has-icon-right">
            <input type="text" className="form-input" placeholder="..." />
            <i className="form-icon loading"></i>
        </div>
    </div>
    <br />
    <div className="form-group">
        <div className="has-icon-left">
            <input type="text" className="form-input" placeholder="..." />
            <i className="form-icon icon icon-check"></i>
        </div>
    </div>
    <br />
    <hr/>
    <h2 className="text-primary">Labels</h2>
    <div className="p-2">
        <span className="label">default label</span>&nbsp;&nbsp;
        <span className="label label-primary">primary label</span>&nbsp;&nbsp;
        <span className="label label-secondary">secondary label</span>&nbsp;&nbsp;
        <span className="label label-success">success label</span>&nbsp;&nbsp;
        <span className="label label-warning">warning label</span>&nbsp;&nbsp;
        <span className="label label-error">error label</span>&nbsp;&nbsp;
    </div>
    <div className="p-2">
        <span className="label label-rounded">default label</span>&nbsp;
        <span className="label label-rounded label-primary">primary label</span>&nbsp;&nbsp;
        <span className="label label-rounded label-secondary">secondary label</span>&nbsp;&nbsp;
        <span className="label label-rounded label-success">success label</span>&nbsp;&nbsp;
        <span className="label label-rounded label-warning">warning label</span>&nbsp;&nbsp;
        <span className="label label-rounded label-error">error label</span>&nbsp;&nbsp;
    </div>
    <hr />
    <h2 className="text-primary">Buttons</h2>
    <div className="p-2 m-2">
        <button className="btn">default button</button>&nbsp;
        <button className="btn btn-primary">primary button</button>&nbsp;
        <button className="btn btn-link">link button</button>&nbsp;
    </div>
    <div className="p-2 m-2">
      <button className="btn btn-active">active button</button>&nbsp;
      <button className="btn btn-success">success button</button>&nbsp;
      <button className="btn btn-error">error button</button>&nbsp;
      <button className="btn btn-warning">warning button</button>
    </div>
    <div className="p-2 m-2">
        <button className="btn btn-primary disabled">primary disabled</button>&nbsp;
        <button className="btn disabled">default disabled</button>&nbsp;
    </div>
    <div className="p-2 m-2">
        <button className="btn loading">button</button>&nbsp;
        <button className="btn btn-primary loading">primary button</button>
    </div>
        </div>
    );
}
