import * as React from "react";
const { useState } = React;

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export enum AppContextType {
    frontend = "frontend",
    backend = "backend",
}
export interface ApplicationContext {
    type: AppContextType;
}
export interface Application {
    App: () => JSX.Element;
}
export type ApplicationFactory = (context: ApplicationContext) =>  Promise<Application>;

/*
<h1>App</h1>
<ul className="menu">
<li className="divider" data-content="LINKS">
</li>
<li className="menu-item">
  <a href="#">
    <i className="icon icon-link"></i> Slack
  </a>
</li>
<li className="menu-item">
  <label className="form-checkbox">
    <input type="checkbox" />
    <i className="form-icon"></i> form-checkbox
  </label>
</li>
<li className="divider"></li>
<li className="menu-item">
  <a href="#">
    <i className="icon icon-link"></i> Settings
  </a>
  <div className="menu-badge">
    <label className="label label-primary">2</label>
  </div>
</li>

<li className="menu-item">
  <a href="#">My profile</a>
  <div className="menu-badge">
    <label className="form-checkbox">
      <input type="checkbox" />
      <i className="form-icon"></i> Public
    </label>
  </div>
</li>
</ul>
*/
/*
  <div className="top-navigation container bg-primary">
      <div className="columns">
          <div className="column col-12 top-navigation__row">&nbsp;</div>
      </div>
  </div>
  <div className="container main-content">
      <div className="columns">
        <div className="column col-3 bg-dark">
        </div>
        <div className="column col-9">

        </div>
      </div>
  </div>
*/

export const getApplication: ApplicationFactory = async (context: ApplicationContext) => {

  const App = () => {
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
                <div className="app-menu-icon__wrap">
                    <i className="icon icon-search"></i>
                </div>
            </div>
            <div className="app-menu-icon">
                <div className="app-menu-icon__wrap">
                    <i className="icon icon-people"></i>
                </div>
            </div>
            <div className="app-menu-icon">
                <div className="app-menu-icon__wrap">
                  <i className="icon icon-shutdown"></i>
                </div>
            </div>
        </div>
        <div className="app-layout">
            <div className="app-header">
                <div className="app-logo">crystallography.io</div>
            </div>
            <div className="app-content">
            </div>
        </div>
      </div>);

  };

  return Promise.resolve({ App });
};
