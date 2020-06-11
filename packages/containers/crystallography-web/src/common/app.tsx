import classNames = require("classnames");
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MatchedRoute, matchRoutes, renderRoutes, RouteConfig } from "react-router-config";
import { CollapseIcon, LogoMobileIcon, NavBtnIcon } from "./icons";
import { AppMobileNavigation, AppNavigation  } from "./layout";
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
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <main className={classNames({ "app": true, "is-open-navigation": isOpen })}>
            <aside className="app-mobile-navigation">
               <div className="app-mobile-navigation-icon" onClick={() => setOpen(!isOpen)}><NavBtnIcon /></div>
               <div className="app-mobile-navigation-logo"><LogoMobileIcon /></div>
            </aside>
            <aside className="app-navigation-menu">
              <AppMobileNavigation onClick={() => setOpen(!isOpen)} />
            </aside>
            <aside className="app-navigation-menu-layout" onClick={() => setOpen(false)}></aside>
            <aside className="app-navigation">
                <AppNavigation />
            </aside>
            <div className="app-collapse-button" onClick={() => setOpen(!isOpen)}>
                <CollapseIcon />
            </div>
            <section className="app-layout">
                  {renderRoutes(props.route.routes)}
            </section>
        </main>
    );
};
