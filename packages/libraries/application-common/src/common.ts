import { RouteConfig } from "react-router-config";

export const VERSION = "0.0.1";

export interface AppPlatformAPI {
    name: string;
    version: string;
}

export interface AppLayout {
    Layout: JSX.Element;
}

export interface Application {
    Routes: RouteConfig[];
}
