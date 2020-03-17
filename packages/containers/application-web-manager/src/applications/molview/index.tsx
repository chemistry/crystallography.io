import * as React from "react";
import { AppPlatformAPI } from "../../interfaces";

const App = ({ route }: any) => (
    <div>
      <h1>Placeholder for molview application</h1>
    </div>
);

export const getMolViewApplication = ({ platformAPI }: { platformAPI: AppPlatformAPI }) => {
    const { version } = platformAPI;
    const Routes = [{
        component: App,
    }];
    return {
      Routes,
    };
};
