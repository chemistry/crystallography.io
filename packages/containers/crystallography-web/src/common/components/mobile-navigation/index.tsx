import * as React from "react";
import { LogoMobileIcon, NavBtnIcon } from "../../icons";
import { NavMenu, NavMenuBottom } from "../nav-menu";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const AppMobileNavigation = () => {
   return (
       <div className="mobile-navigation">
          <div className="mobile-navigation-icon"><NavBtnIcon /></div>
          <div className="mobile-navigation-logo"><LogoMobileIcon /></div>
       </div>
    );
};
