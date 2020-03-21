export interface Plugin {
    initialize(context: PlatfomContext): Promise<void>;
}
export type PlatformFactory = () => Platform;

export interface Platform {
    addPlugins(plugins: Plugin[]): Promise<void>;
    initialize(): Promise<void>;
    getContent?(): Promise<{ statusCode: number, content: string }>;
    hydrate?(): string;
}

export enum ContentBuildState {
    views = "views",
    layout = "layout",
    html = "html",
}

export interface PlatfomContext {
    name: string;
    type: PlatformType;
    version: string;

    addMiddleWare(param: {
        order: number,
        middleWare: any,
    }): void;
}

export enum PlatformType {
    backend = "backend",
    frontend = "frontend",
    desktop = "desktop",
}
