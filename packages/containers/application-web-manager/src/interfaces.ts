export interface Plugin {
    initialize(context: PlatfomContext): Promise<void>;
}
export type PlatformFactory = () => Platform;
export type PluginFactory = () => Plugin;

export interface MiddleWareParams {
    statusCode: number;
    html: string;
    layout: () => JSX.Element;
    views: {
        [key: string]: () => JSX.Element,
    };
}

export type MiddleWare = (param: MiddleWareParams) => Promise<MiddleWareParams>;

export interface Platform {
    addPlugins(plugins: Plugin[]): Promise<void>;
    initialize(): Promise<void>;
    getContent?(): Promise<{ statusCode: number, html: string }>;
    hydrate?(): string;
}

export interface PlatfomContext {
    name: string;
    type: PlatformType;
    version: string;

    addMiddleWare(param: {
        order: number,
        middleWare: MiddleWare,
    }): void;
}

export enum PlatformType {
    backend = "backend",
    frontend = "frontend",
    desktop = "desktop",
}
