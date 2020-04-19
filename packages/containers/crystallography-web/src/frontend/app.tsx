import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContextType, ApplicationContext, ApplicationFactory, getApplication } from "../common";

const appContext: ApplicationContext =  {
   type: AppContextType.frontend,
};

(async () => {
  const { App } = await getApplication(appContext);

  ReactDOM.render(
      <App />,
      document.getElementById("root"),
  );
})();
