import { Config, IEnv } from '../config';

const stubEnv: IEnv = {
    API_BASE_URL: 'api-base-url',
    APP_BASE_URL: 'app-base-url',
    LOGIN_APP_BASE_URL: 'login-app-base-url',
    LOGIN_API_BASE_URL: 'login-api-base-url',
    NODE_ENV: 'production'
};

describe('config', () => {
    it('apiBaseUrl should be populated by env.API_BASE_URL', () => {
        expect(new Config(stubEnv).apiBaseUrl).toBe(stubEnv.API_BASE_URL);
    });

    it('appBaseUrl should be populated by env.APP_BASE_URL', () => {
        expect(new Config(stubEnv).appBaseUrl).toBe(stubEnv.APP_BASE_URL);
    });

    it('appBaseUrl should be populated by env.LOGIN_API_BASE_URL', () => {
        expect(new Config(stubEnv).loginApiBaseUrl).toBe(stubEnv.LOGIN_API_BASE_URL);
    });

    it('appBaseUrl should be populated by env.APP_BASE_URL', () => {
        expect(new Config(stubEnv).loginAppBaseUrl).toBe(stubEnv.LOGIN_APP_BASE_URL);
    });

    it('development should be false given env.NODE_ENV is "production"', () => {
        expect(new Config(stubEnv).development).toBe(false);
    });

    it('development should be true given env.NODE_ENV is not "production"', () => {
        expect(new Config(Object.assign({}, stubEnv, { NODE_ENV: 'something else' })).development).toBe(true);
    });
});
