import * as React from "react";
import { NavLink } from "react-router-dom";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const NavMenuBottom = () => {
    return (<div className="nav-menu">
        <ul className="nav-menu-list">
          <li>
              <NavLink to="/login" strict className="nav-menu-item" activeClassName="">
                  <i className="icon icon-shutdown"></i>
              </NavLink>
          </li>
        </ul>
    </div>);
};

export const NavMenu = () => {
    return (<div className="nav-menu">
        <ul className="nav-menu-list">
          <li>
              <NavLink to="/" exact strict className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-search"></i>
              </NavLink>
          </li>
          <li>
              <NavLink to="/authors" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-people"></i>
              </NavLink>
          </li>
          <li>
              <NavLink to="/catalog" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-apps"></i>
              </NavLink>
          </li>
          <li>
              <NavLink to="/login" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-time"></i>
              </NavLink>
          </li>
          <li>
              <NavLink to="/register" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-message"></i>
              </NavLink>
          </li>
        </ul>
    </div>);
};
