import * as React from "react";
import "./index.scss";
import { CloseIcon } from "../../icons";
import { NavMenuBottom, NavMenuTop } from "../nav-menu";


export const AppMobileNavigation = ({ onClick }: { onClick: () => void}) => {
   return (
       <div className="app-mobile-menu">
          <div className="app-mobile-menu-header">
              <div className="app-mobile-menu-icon" onClick={onClick}><CloseIcon /></div>
              <div className="app-mobile-menu-logo">Menu</div>
          </div>
          <div className="app-mobile-menu-content">
              <div className="app-mobile-menu-content-top">
                  <NavMenuTop onClick={onClick} />
              </div>
              <div className="app-mobile-menu-content-bottom">
                 <NavMenuBottom onClick={onClick} />
              </div>
          </div>
       </div>
    );
};
