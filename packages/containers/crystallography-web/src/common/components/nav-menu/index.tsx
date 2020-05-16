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
              <NavLink to="/" exact strict className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-people"></i>Search
              </NavLink>
          </li>
          <li>
              <NavLink to="/authors" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-mail"></i>Authors
              </NavLink>
          </li>
          <li>
              <NavLink to="/catalog" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-time"></i>Catalog
              </NavLink>
          </li>
          <li>
              <NavLink to="/about" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-time"></i>About
              </NavLink>
          </li>
          <li>
              <NavLink to="/news" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-time"></i>News
              </NavLink>
          </li>
          <li>
              <NavLink to="/contact" className="nav-menu-item" activeClassName="active">
                  <i className="icon icon-time"></i>Contact
              </NavLink>
          </li>
        </ul>
    </div>);
};
