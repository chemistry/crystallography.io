import * as React from "react";
import { renderToString } from "react-dom/server";
import { App } from "../common";

export const componentHTML = renderToString((
  <div>
    <App />
  </div>
));
