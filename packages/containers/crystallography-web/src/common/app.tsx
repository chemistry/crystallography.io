import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { MatchedRoute, matchRoutes, renderRoutes, RouteConfig } from "react-router-config";
import { AppNavigation } from "./components";
import { LogoIcon, TitleIcon } from "./icons";
// import LogoTitle from "./title.svg";

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

const extractTitleMetaInfo = (branches: Array<MatchedRoute<{}>>) => {
    return branches
      .map(({ route: { title } }) => title)
      .filter((title) => !!title)
      .join(",");
};

export const App = (props: { route: { routes: RouteConfig[] }, location: { pathname: string }}) => {
    const branches = matchRoutes(props.route.routes, props.location.pathname);
    const title = extractTitleMetaInfo(branches);

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <main className="app">
            <aside className="app-navigation">
                <AppNavigation />
            </aside>
            <section className="app-layout">
                <header className="app-layout-header">
                    <div className="app-layout-header-image">
                      <LogoIcon />
                    </div>
                    <div className="app-layout-header-title">
                      <TitleIcon />
                    </div>
                </header>
                <div className="app-layout-content">
                  {renderRoutes(props.route.routes)}
                </div>
            </section>
        </main>
    );
};
