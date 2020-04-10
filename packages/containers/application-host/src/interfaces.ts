export interface ApplicationContext {
    initialize: () => Promise<void>;
    bootstrap?: () => Promise<void>;
}

export interface ApplicationModule {
    name: string;
    initialize: () => Promise<void>;
    bootstrap?: () => Promise<void>;
}
