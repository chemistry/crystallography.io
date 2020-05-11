import * as React from "react";
import { NavLink } from "react-router-dom";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const NavMenu = () => {
    return (<div className="nav-menu">
        <div className="h3 nav-menu-title">
          <div className="nav-menu-title-text">
            Main Menu
          </div>
          <div className="nav-menu-title-icon">
            <i className="icon icon-arrow-down"></i>
          </div>
        </div>
        <ul className="nav-menu-list">
          <li>
              <NavLink to="/" strict className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-people"></i>&nbsp;&nbsp;Messages
              </NavLink>
          </li>
          <li>
              <NavLink to="/about" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-mail"></i>&nbsp;&nbsp;Mail
              </NavLink>
          </li>
          <li>
              <NavLink to="/news" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-time"></i>&nbsp;&nbsp;Time
              </NavLink>
          </li>
        </ul>
    </div>);
};
