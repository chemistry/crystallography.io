import * as React from "react";
import { NavLink } from "react-router-dom";
import { LogoIcon, TitleIcon } from "../../icons";
import { NavMenuBottom, NavMenuTop } from "../nav-menu";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const AppNavigation = () => {
   return (
     <>
       <header className="app-navigation-header">
          <NavLink to="/" exact strict className="app-navigation-header-logo">
              <div className="app-navigation-header__logo-icon">
                <LogoIcon />
              </div>
              <div className="app-navigation-header__logo-title">
                <TitleIcon />
              </div>
          </NavLink>
          <div className="app-navigation-header-menu-top">
              <NavMenuTop />
          </div>
          {
              /*
                <div className="app-navigation-header-menu-bottom">
                    <NavMenuBottom />
                </div>
            */
          }
       </header>
      </>
    );
};
