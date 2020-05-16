import * as React from "react";
import { renderRoutes } from "react-router-config";
import { AppNavigation } from "./components";
import { useFirebase } from "./services";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const App = (props: any) => {
    const isLoaded = useFirebase();

    return (
        <main className="app">
            <aside className="app-navigation">
                <AppNavigation />
            </aside>
            <section className="app-layout">
                <header className="app-layout-header">
                </header>
                <div className="app-layout-content">
                  {isLoaded}
                </div>
            </section>
        </main>
    );
};
