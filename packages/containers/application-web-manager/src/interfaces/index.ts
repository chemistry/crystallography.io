import * as React from "react";

export interface AppPlatformAPI {
    name: string;
    version: string;
}

export interface AppLayout {
    Layout: JSX.Element;
}

export interface App {
    Routes: any;
}
