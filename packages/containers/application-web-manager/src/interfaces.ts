export interface Plugin {
    initialize(context: PlatfomContext): Promise<void>;
}

export interface Platform {
    addPlugin(plugin: Plugin): Promise<void>;
    initialize(): Promise<void>;
    getIndexHTML?(): string;
    renderToString?(): string;
    hydrate?(): string;
}

export interface PlatfomContext {
    name: string;
    type: PlatformType;
    version: string;

    registerView(param: {
        name: string,
        version: string,
        order: number,
        factory: () => JSX.Element,
    }): void;
    registerResources(param: {
        js: string[],
        css: string[],
    }): void;
    registerIndexHtml(factory: (param: {
      resources: {
        css: string[]
        js: string[],
      },
    }) => string): void;
}

export enum PlatformType {
    backend = "backend",
    frontend = "frontend",
    desktop = "desktop",
}
