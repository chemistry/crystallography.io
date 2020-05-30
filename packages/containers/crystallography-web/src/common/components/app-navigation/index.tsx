import * as React from "react";
import { LogoIcon, TitleIcon } from "../../icons";
import { NavMenu, NavMenuBottom } from "../nav-menu";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const AppNavigation = () => {
   return (
     <>
       <header className="app-navigation-header">
          <div className="app-navigation-header-logo">
            <div className="app-navigation-header__logo-icon">
              <LogoIcon />
            </div>
            <div className="app-navigation-header__logo-title">
              <TitleIcon />
            </div>
          </div>
       </header>
      </>
    );
};
/*
  <div className="app-navigation-menu-top">
     <NavMenu />
  </div>
  <div className="app-navigation-menu-bottom">
     <NavMenuBottom />
  </div>
*/
