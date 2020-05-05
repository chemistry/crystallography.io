import * as React from "react";
import { renderRoutes } from "react-router-config";
import { Link } from "react-router-dom";

const { useState } = React;

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const MainPage = () => {
  return (<h1>Main</h1>);
};

export const NewsPage = () => {
  return (<h1>News</h1>);
};

export const AboutPage = () => {
   return (<h1>About</h1>);
};

export const NotFoundPage = () => {
  return (<h1>Not Found Page</h1>);
};

export const App = (props: any) => {
    const [isOpen, setOpen] = useState(false);

    return (<div className={`app ${isOpen ? "open" : ""}`}>
      <div className="app-side-bar">
          <div className="app-side-bar__menu">
              <div className="app-menu-icon">
                  <div className="app-menu-icon__wrap" onClick={() => setOpen(!isOpen)}>
                      <i className="icon icon-menu"></i>
                  </div>
              </div>
          </div>
          <div className="app-menu-icon">
              <Link to="/">
                  <div className="app-menu-icon__wrap">
                      <i className="icon icon-search"></i>
                  </div>
              </Link>
          </div>
          <div className="app-menu-icon">
              <Link to="/about">
                <div className="app-menu-icon__wrap">
                    <i className="icon icon-people"></i>
                </div>
              </Link>
          </div>
          <div className="app-menu-icon">
              <Link to="/news">
                <div className="app-menu-icon__wrap">
                    <i className="icon icon-shutdown"></i>
                </div>
              </Link>
          </div>
      </div>
      <div className="app-layout">
          <div className="app-header">
              <div className="app-logo">crystallography.io</div>
          </div>
          <div className="app-content">
              {renderRoutes(props.route.routes)}
          </div>
      </div>
    </div>);

};
