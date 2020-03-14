import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { renderRoutes } from "react-router-config";
import { Router } from "react-router-dom";
import { getApplication } from "../common";

const platform = {
    name: "frontend",
    version: "0.0.1",
};

const history = createBrowserHistory();
const { Routes } = getApplication({ platform });
const App = () => renderRoutes(Routes);

ReactDOM.render(
      <Router
          history={history}
        ><App />
      </Router>,
    document.getElementById("app"),
);
