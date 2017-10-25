export interface IEnv {
    API_BASE_URL: string;
    APP_BASE_URL: string;
    LOGIN_APP_BASE_URL: string;
    LOGIN_API_BASE_URL: string;
    NODE_ENV: string;
}

export class Config {
    apiBaseUrl: string;
    appBaseUrl: string;
    loginAppBaseUrl: string;
    loginApiBaseUrl: string;
    development: boolean;

    constructor(env: IEnv) {
        this.apiBaseUrl = env.API_BASE_URL;
        this.appBaseUrl = env.APP_BASE_URL;
        this.loginAppBaseUrl = env.LOGIN_APP_BASE_URL;
        this.loginApiBaseUrl = env.LOGIN_API_BASE_URL;
        this.development = env.NODE_ENV !== 'production';
    }
}