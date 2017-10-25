export class StorageFacade {
    constructor(private underlyingStorage: Storage) {
    }

    clear() {
        this.underlyingStorage.clear();
    }

    getItem(key: string) {
        return this.underlyingStorage.getItem(key);
    }

    removeItem(key: string) {
        return this.underlyingStorage.removeItem(key);
    }

    setItem(key: string, data: string) {
        return this.underlyingStorage.setItem(key, data);
    }

    addEventListener(listener: (this: Window, event: StorageEvent) => any, useCapture?: boolean) {
        window.addEventListener('storage', listener, useCapture);
    }
}
