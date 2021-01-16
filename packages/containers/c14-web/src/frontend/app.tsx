import { createBrowserHistory } from "history";
import * as ReactGA from 'react-ga';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { renderRoutes } from "react-router-config";
import { Router } from "react-router-dom";
import { AppContextType, ApplicationContext, getApplication } from "../common";

import { registerSW } from "./register-sw";

const appContext: ApplicationContext =  {
   type: AppContextType.frontend,
};

(async () => {
    const history = createBrowserHistory();

    if (process.env.NODE_ENV !== 'development') {
        ReactGA.initialize('UA-125802766-1');
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);

        history.listen((location, action) => {
            ReactGA.set({ page: location.pathname });
            ReactGA.pageview(location.pathname);
        });
    }

  const { Routes, getStore } = await getApplication(appContext);

  const initialState = (window as any).__INITIAL_STATE__ || {};
  const store = getStore(initialState);

  ReactDOM.render(
      <Provider store={store}>
        <Router
            history={history}
        >{renderRoutes(Routes)}</Router>
      </Provider>,
      document.getElementById("root"),
  );

  registerSW();
})();
