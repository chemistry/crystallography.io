import * as React from "react";
import { NavMenu, NavMenuBottom } from "../nav-menu";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const AppNavigation = () => {
   return (
     <>
       <header className="app-navigation-header">
           <i className="icon icon-menu"></i>
       </header>
       <div className="app-navigation-menu-top">
          <NavMenu />
       </div>
       <div className="app-navigation-menu-bottom">
          <NavMenuBottom />
       </div>
      </>
    );
};
