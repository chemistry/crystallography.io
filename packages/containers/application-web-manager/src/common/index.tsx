import * as React from "react";
import { renderRoutes } from "react-router-config";
import { Link } from "react-router-dom";

export interface AppPlatform {
    name: string;
    version: string;
}

const App = ({ route }: any) => (
    <div>
      <ul>
        <li>
          <Link to="/news">About</Link>
        </li>
        <li>
          <Link to="/about">Topics</Link>
        </li>
      </ul>
      <div>{renderRoutes(route.routes)}</div>
    </div>
);

const HomePage = () => (
    <h1>Home Page</h1>
);

const NewsPage = () => (
    <h1>News</h1>
);

const AboutPage = () => (
    <h1>About</h1>
);

export const getApplication = ({ platform }: { platform: AppPlatform }) => {
    const { version } = platform;
    const Routes = [{
        component: App,
        routes: [
            {
               path: "/",
               exact: true,
               component: HomePage,
            },
            {
                path: "/news",
                component: NewsPage,
            },
            {
                path: "/about",
                component: AboutPage,
            },
        ],
    }];
    return {
      Routes,
    };
};
