import React from "react";
import { NavLink } from "react-router-dom";

export const SearchTab = ()=> {
    return  (<ul className="tab tab-block">
                <li className="tab-item">
                    <NavLink to="/" exact strict activeClassName="active">
                        Structure
                    </NavLink>
                </li>
                <li className="tab-item">
                    <NavLink to="/search/author" activeClassName="active">
                        Author
                    </NavLink>
                </li>
                <li className="tab-item">
                    <NavLink to="/search/name" activeClassName="active">
                        Name
                    </NavLink>
                </li>
                <li className="tab-item">
                    <NavLink to="/search/formula" exact activeClassName="active">
                        Formula
                    </NavLink>
                </li>
                <li className="tab-item">
                    <NavLink to="/search/unitcell" exact activeClassName="active">
                        Unit Cell
                    </NavLink>
                </li>
            </ul>
        );
}
