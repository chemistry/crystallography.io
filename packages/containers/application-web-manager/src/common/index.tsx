import * as React from "react";

export interface AppPlatform {
    name: string;
    version: string;
}

const App = () => (
    <h1>App host</h1>
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
