import * as React from "react";
import { useSelector } from "react-redux";
import { renderRoutes, RouteConfig } from "react-router-config";
import { AppNavigation } from "./components";
import { useFirebase } from "./services";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const App = (props: { route: { routes: RouteConfig[] }}) => {
    return (
        <main className="app">
            <aside className="app-navigation">
                <AppNavigation />
            </aside>
            <section className="app-layout">
                <header className="app-layout-header">
                </header>
                <div className="app-layout-content">
                  {renderRoutes(props.route.routes)}
                </div>
            </section>
        </main>
    );
};
