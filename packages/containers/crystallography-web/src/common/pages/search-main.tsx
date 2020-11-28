import * as React from "react";
import { SearchTab } from "../components";

export const SearchPage = () => {

    return (
      <div className="search-layout-tabs">
          <header className="app-layout-header">
                <h2 className="text-primary">Crystal Structure Search</h2>
                <SearchTab />
          </header>
          <div className="app-layout-content">
          </div>
      </div>
  );
};

/*
         <div>
                <h2 className="text-primary">Buttons</h2>
                <div className="p-2 m-2">
                    <button className="btn">Default Button</button>&nbsp;&nbsp;
                    <button className="btn disabled">Disabled Button</button>&nbsp;
                </div>
                <div className="p-2 m-2">
                    <button className="btn btn-primary">Primary button</button>&nbsp;&nbsp;
                    <button className="btn btn-primary disabled">Disabled Primary</button>&nbsp;
                </div>

                <div className="p-2 m-2">
                    <button className="btn btn-link">Link button</button>&nbsp;&nbsp;
                    <button className="btn btn-link disabled">Disabled Link</button>&nbsp;
                </div>

                <div className="p-2 m-2">
                    <button className="btn"><i className="icon icon-plus"></i>&nbsp;Default Button</button>&nbsp;&nbsp;
                    <button className="btn btn-primary"><i className="icon icon-plus"></i>&nbsp;Primary Button</button>&nbsp;&nbsp;
                    <button className="btn btn-link"><i className="icon icon-plus"></i>&nbsp;Link Button</button>&nbsp;&nbsp;
                </div>

                <div className="p-2 m-2">
                    <button className="btn btn-icon"><i className="icon icon-plus"></i></button>&nbsp;&nbsp;
                    <button className="btn btn-primary btn-icon"><i className="icon icon-plus"></i></button>&nbsp;&nbsp;
                    <button className="btn btn-link btn-icon"><i className="icon icon-plus"></i></button>&nbsp;&nbsp;
                </div>

                <hr/>

                <hr/>
                <h2 className="text-primary">Typography</h2>
                <h1>Headline 1</h1>
                <h2>Headline 2</h2>
                <h3>Headline 3</h3>
                <h4>Headline 4</h4>
                <h5>Headline 5</h5>
                <h6>Headline 6</h6>
                <p>Default Paragraph - body1  </p>
                <p><a href="/">user link</a></p>
                <hr />
                <h2 className="text-primary">Lists</h2>
                <ul>
                    <li>list item 1</li>
                    <li>list item 2
                    <ul>
                        <li>list item 2.1</li>
                        <li>list item 2.2</li>
                        <li>list item 2.3</li>
                    </ul>
                    </li>
                    <li>list item 3</li>
                </ul>
                <hr />
    </div>
*/

/*

*/
