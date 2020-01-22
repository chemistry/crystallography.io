import * as React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./application";

export const componentHTML = renderToString((
  <div>
    <App />
  </div>
));
