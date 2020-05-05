import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { renderRoutes } from "react-router-config";
import { Router } from "react-router-dom";
import { AppContextType, ApplicationContext, getApplication } from "../common";

import { registerSW } from "./register-sw";

const appContext: ApplicationContext =  {
   type: AppContextType.frontend,
};

(async () => {
  const history = createBrowserHistory();
  const { Routes } = await getApplication(appContext);

  ReactDOM.render(
      <Router
          history={history}
      >{renderRoutes(Routes)}</Router>,
      document.getElementById("root"),
  );

  registerSW();
})();
