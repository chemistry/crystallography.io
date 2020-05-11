import * as React from "react";
import { NavMenu } from "../nav-menu";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const AppNavigation = () => {
   return (
     <>
       <header className="app-navigation-header">
           <div className="">
               <div className="app-navigation-header-logo"><h2>Structure Search</h2></div>
               <div className="app-navigation-header-menu"><i className="icon icon-menu"></i></div>
           </div>
       </header>

       <NavMenu />
       <NavMenu />
      </>
    );
};
