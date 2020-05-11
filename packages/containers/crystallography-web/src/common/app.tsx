import * as React from "react";
import { renderRoutes } from "react-router-config";
import { AppNavigation } from "./components";

const { useState } = React;

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

export const App = (props: any) => {
    const [isOpen, setOpen] = useState(false);
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
                  <h1>Messages</h1>
                  <h2>Conversations</h2>
                  <h3>h3 - content</h3>
                  <h4>h4 - content</h4>
                  <p>Have you seen my latest post with some designs which you could use in your process</p>
                </div>
            </section>
        </main>
    );
};
