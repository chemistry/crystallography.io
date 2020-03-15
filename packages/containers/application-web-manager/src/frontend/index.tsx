import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { getLayout } from "../layout";
import { getPlatformAPI } from "./platform-api";

const history = createBrowserHistory();
const platform = getPlatformAPI();
const { Layout } = getLayout({ platform });

ReactDOM.render(
      <Router
          history={history}
        ><Layout />
      </Router>,
    document.getElementById("app"),
);
