import * as React from "react";

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

export const getApplication: ApplicationFactory = async (context: ApplicationContext) => {
  const App = () => (<div className="app">
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
              <h1>App</h1>
          </div>
        </div>
    </div>
  </div>);

  return Promise.resolve({ App });
};
