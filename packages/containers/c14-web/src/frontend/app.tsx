import { createBrowserHistory } from "history";
import * as ReactGA from 'react-ga';
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Provider } from "react-redux";
import { renderRoutes } from "react-router-config";
import { Router } from "react-router-dom";
import { AppContextType, ApplicationContext, getApplication } from "../common";

import { registerSW } from "./register-sw";

const appContext: ApplicationContext =  {
   type: AppContextType.frontend,
};

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: "https://c8451c59d8bf44b8b7734de1a5b380d7@o187202.ingest.sentry.io/5595579",
        autoSessionTracking: true,
        integrations: [
        new Integrations.BrowserTracing(),
        ],
        tracesSampleRate: 1.0,
    });
}

(async () => {
    const history: any = createBrowserHistory();

    if (process.env.NODE_ENV !== 'development') {
        ReactGA.initialize('UA-125802766-1');
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);

        history.listen((location: any) => {
            ReactGA.set({ page: location.pathname });
            ReactGA.pageview(location.pathname);
        });
    }

  const { Routes, getStore } = await getApplication(appContext);

  const initialState = (window as any).__INITIAL_STATE__ || {};
  const store = getStore(initialState);

  const ProviderAny: any = Provider;
  ReactDOM.render(
      <ProviderAny store={store}>
        <Router
            history={history}
        >{renderRoutes(Routes)}</Router>
      </ProviderAny>,
      document.getElementById("root"),
  );

  registerSW();
})();
