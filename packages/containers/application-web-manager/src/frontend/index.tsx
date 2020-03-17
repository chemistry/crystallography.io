import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { Applications } from "../applications";
import { getPlatformAPI } from "./platform-api";

// Initializing Core Platrofm Components
const history = createBrowserHistory();
const platformAPI = getPlatformAPI();

// Load Platform Application
const application = Applications.search.getApplication({ platformAPI });

// Load Platform Layout and Features
import { getLayout } from "../layout";
const { Layout } = getLayout({ platformAPI, application });

ReactDOM.render(
    <Router
      history={history}
    ><Layout />
    </Router>,
    document.getElementById("app"),
);
