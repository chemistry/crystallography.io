import { getApplication } from "@chemistry/application-cod-search";
import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { getPlatformAPI } from "./platform-api";

// Initializing Core Platrofm Components
const history = createBrowserHistory();
const platformAPI = getPlatformAPI();

// Load Platform Application
const application = getApplication({ platformAPI });

// Load Platform Layout and Features
import { getLayout } from "../layout";
const { Layout, getIndexHTML } = getLayout({ platformAPI, application });

// Replace index.html content with correct content
// That might happens wwhen wrong HTML were served
// e.g. for local webpack serve
if (document.getElementById("app") === null) {
    const indexHTML = getIndexHTML();
    document.open("text/html", "replace");
    document.write(indexHTML);
    document.close();
}

ReactDOM.render(
    <Router
      history={history}
    ><Layout />
    </Router>,
    document.getElementById("app"),
);
