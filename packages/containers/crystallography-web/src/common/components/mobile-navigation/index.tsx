import * as React from "react";
import { CloseIcon } from "../../icons";
import { NavMenuBottom, NavMenuTop } from "../nav-menu";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const AppMobileNavigation = ({ onClick }: { onClick: () => void}) => {
   return (
       <div className="app-mobile-menu">
          <div className="app-mobile-menu-header">
              <div className="app-mobile-menu-icon" onClick={onClick}><CloseIcon /></div>
              <div className="app-mobile-menu-logo">Menu</div>
          </div>
          <div className="app-mobile-menu-content">
              <div className="app-mobile-menu-content-top">
                  <NavMenuTop />
              </div>
              <div className="app-mobile-menu-content-bottom">
                 <NavMenuBottom />
              </div>
          </div>
       </div>
    );
};
