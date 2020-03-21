export interface Plugin {
    initialize(context: PlatfomContext): Promise<void>;
}
export type PlatformFactory = () => Platform;

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
        middleWare: any,
    }): void;
}

export enum PlatformType {
    backend = "backend",
    frontend = "frontend",
    desktop = "desktop",
}
