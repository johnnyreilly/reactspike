import { SecurityStore, USER_ID } from '../securityStore';
import { Api } from '../../../api/index';
import { StorageFacade } from '../../storageFacade';
import { ILoginResultView, ICookieView } from '../../../api/security';

describe('securityStore', () => {
    it('initial state is as expected', () => {
        const mockApi = new Api(undefined);
        const securityStore = new SecurityStore(mockApi, undefined);

        expect(securityStore.userId).toBe(null);
        expect(securityStore.isLoggedIn).toBe(false);
    });

    describe('isLoggedIn', () => {
        it('given no user id, isLoggedIn is false', () => {
            const mockApi = new Api(undefined);
            const securityStore = new SecurityStore(mockApi, undefined);
    
            securityStore.setUserId('123');
            securityStore.setUserId(null);
            
            expect(securityStore.isLoggedIn).toBe(false);
        });

        it('given a user id, isLoggedIn is true', () => {
            const mockApi = new Api(undefined);
            const securityStore = new SecurityStore(mockApi, undefined);
            const userId = 'UserId123';
    
            securityStore.setUserId(userId);
    
            expect(securityStore.isLoggedIn).toBe(true);
        });
    });

    describe('onStorageChanged', () => {
        it('given user id has changed, userId should be set to that value', () => {
            const mockApi = new Api(undefined);
            const securityStore = new SecurityStore(mockApi, undefined);
            const userId = 'UserId123';

            securityStore.onStorageChanged({ key: USER_ID, newValue: userId } as any);

            expect(securityStore.userId).toBe(userId);
        });

        it('given irrelevant change has happened, nothing changes', () => {
            const mockApi = new Api(undefined);
            const securityStore = new SecurityStore(mockApi, undefined);

            securityStore.onStorageChanged({ key: 'irrelevant', newValue: 'irrelevant value' } as any);

            expect(securityStore.userId).toBe(null);
        });
    });

    describe('initialise', () => {
        it('given storage contains user id, userId should be set to that value', async () => {
            const mockApi = new Api(undefined);
            const storage = new StorageFacade(undefined);
            const securityStore = new SecurityStore(mockApi, storage);
            const userId = 'UserId123';
            storage.getItem = jest.fn((_key: string) => userId);
            storage.addEventListener = jest.fn();
    
            securityStore.initialise();
    
            expect(securityStore.userId).toBe(userId);
            expect(securityStore.isLoggedIn).toBe(true);
            expect(storage.addEventListener).toHaveBeenCalledWith(securityStore.onStorageChanged);
        });

        it('given storage does not contain user id, userId should remain null', async () => {
            const mockApi = new Api(undefined);
            const storage = new StorageFacade(undefined);
            const securityStore = new SecurityStore(mockApi, storage);
            storage.getItem = jest.fn((_key: string) => null);
            storage.addEventListener = jest.fn();
    
            securityStore.initialise();
    
            expect(securityStore.userId).toBe(null);
            expect(securityStore.isLoggedIn).toBe(false);
            expect(storage.addEventListener).toHaveBeenCalledWith(securityStore.onStorageChanged);
        });
    });

    describe('setUserId', () => {
        it('given a user id, userId should be set to that value', () => {
            const mockApi = new Api(undefined);
            const securityStore = new SecurityStore(mockApi, undefined);
            const userId = 'UserId123';
    
            securityStore.setUserId(userId);
    
            expect(securityStore.userId).toBe(userId);
        });
    });

    describe('login', () => {
        it('given a successful login, user id should be set and saved to storage', async () => {
            const mockApi = new Api(undefined);
            const loginResult = { userId: 'UserId123', cookie: undefined as ICookieView };
            mockApi.security.createToken = jest.fn(() => Promise.resolve<ILoginResultView>(loginResult));
            const storage = new StorageFacade(undefined);
            const securityStore = new SecurityStore(mockApi, storage);
            storage.setItem = jest.fn();
    
            await securityStore.login({ username: 'ryan', password: 'secretIdentity' });
    
            expect(securityStore.userId).toBe(loginResult.userId);
            expect(storage.setItem).toHaveBeenCalledWith(USER_ID, loginResult.userId);
        });

        it('given a login fails, user id should be not be set or saved to storage', async () => {
            const mockApi = new Api(undefined);
            const error = 'I never knew you';
            mockApi.security.createToken = jest.fn(() => Promise.reject(error));
            const storage = new StorageFacade(undefined);
            const securityStore = new SecurityStore(mockApi, storage);
            storage.setItem = jest.fn();
    
            await securityStore.login({ username: 'ryan', password: 'secretIdentity' });
    
            expect(securityStore.userId).toBe(null);
            expect(storage.setItem).not.toHaveBeenCalled();
            expect(securityStore.loginResult.error).toBe(error);
        });
    });

    describe('logout', () => {
        it('user id should be null and saved to storage', () => {
            const mockApi = new Api(undefined);
            const storage = new StorageFacade(undefined);
            const securityStore = new SecurityStore(mockApi, storage);
            securityStore.setUserId('initial user id');
            securityStore.loginResult.reset = jest.fn();
            storage.removeItem = jest.fn();

            securityStore.logout();
    
            expect(securityStore.loginResult.reset).toHaveBeenCalled();
            expect(securityStore.userId).toBe(null);
            expect(storage.removeItem).toHaveBeenCalledWith(USER_ID);
        });
    });
});
