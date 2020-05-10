import * as React from "react";
import { renderRoutes } from "react-router-config";
import { Link, NavLink } from "react-router-dom";

const { useState } = React;

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const MainPage = () => {
  return (<h1>Messages</h1>);
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
/*
<div className={`app ${isOpen ? "open" : ""}`}>
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
</div>
*/
export const App = (props: any) => {
    const [isOpen, setOpen] = useState(false);
    return (
        <main className="app">
            <aside className="app-navigation">
              <header className="app-navigation-header">
                  <div className="">
                      <div className="app-navigation-header-logo"><h2>Structure Search</h2></div>
                      <div className="app-navigation-header-menu"><i className="icon icon-menu"></i></div>
                  </div>
              </header>
              <div className="nav-menu">
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
                        <NavLink to="/" className="nav-menu-item" activeClassName="active">
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
              </div>

              <div className="nav-menu">
                  <div className="h3 nav-menu-title">
                    <div className="nav-menu-title-text">
                      About
                    </div>
                    <div className="nav-menu-title-icon">
                      <i className="icon icon-arrow-down"></i>
                    </div>
                  </div>
                  <ul className="nav-menu-list">
                    <li>
                        <NavLink to="/1" className="nav-menu-item" activeClassName="active">
                          <i className="icon icon-time"></i>&nbsp;&nbsp;About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/2" className="nav-menu-item" activeClassName="active">
                          <i className="icon icon-time"></i>&nbsp;&nbsp;Contact Us
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/3" className="nav-menu-item" activeClassName="active">
                          <i className="icon icon-time"></i>&nbsp;&nbsp;People
                        </NavLink>
                    </li>
                  </ul>
              </div>
            </aside>
            <section className="app-layout">
                <header className="app-layout-header">
                </header>
                <div className="app-layout-content">
                  {renderRoutes(props.route.routes)}
                  <h1>Messages</h1>
                  <h2>Conversations</h2>
                  <h3>h3 - content</h3>
                  <h4>h4 - content</h4>
                  <p>Have you seen my latest post with some designs which you could use in your process</p>
                </div>
            </section>
        </main>
    );
};
