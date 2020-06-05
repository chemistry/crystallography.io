import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  MenuAuthorsIcon, MenuInfoIcon, MenuNewsIcon, MenuSearchIcon, SearchHistoryIcon,
  SignInIcon,
} from "../../icons";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const NavMenuBottom = () => {
    return (<div className="nav-menu">
        <ul className="nav-menu-list">
          <li>
              <NavLink to="/login" strict className="nav-menu-item" activeClassName="active">
                  <div className="nav-menu-item__icon"><SignInIcon /></div>
                  <div className="nav-menu-item__title">Login</div>
              </NavLink>
          </li>
        </ul>
    </div>);
};

export const NavMenuTop = () => {
    return (<div className="nav-menu">
        <ul className="nav-menu-list">
          <li>
              <NavLink to="/" exact strict className="nav-menu-item" activeClassName="active">
                  <div className="nav-menu-item__icon"><MenuSearchIcon /></div>
                  <div className="nav-menu-item__title">Search</div>
              </NavLink>
          </li>
          <li>
              <NavLink to="/search-history" className="nav-menu-item" activeClassName="active">
                  <div className="nav-menu-item__icon"><SearchHistoryIcon /></div>
                  <div className="nav-menu-item__title">Search History</div>
              </NavLink>
          </li>
          <li>
              <NavLink to="/authors" className="nav-menu-item" activeClassName="active">
                  <div className="nav-menu-item__icon"><MenuAuthorsIcon /></div>
                  <div className="nav-menu-item__title">Authors</div>
              </NavLink>
          </li>
          <li>
              <NavLink to="/about" className="nav-menu-item" activeClassName="active">
                  <div className="nav-menu-item__icon"><MenuInfoIcon /></div>
                  <div className="nav-menu-item__title">About Us</div>
              </NavLink>
          </li>
          <li>
              <NavLink to="/news" className="nav-menu-item" activeClassName="active">
                  <div className="nav-menu-item__icon"><MenuNewsIcon /></div>
                  <div className="nav-menu-item__title">News</div>
              </NavLink>
          </li>

        </ul>
    </div>);
};
