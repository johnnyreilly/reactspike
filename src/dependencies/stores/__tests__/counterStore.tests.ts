import { CounterStore } from '../counterStore';

describe('counterStore', () => {
    it('initial count should be 0', () => {
        expect(new CounterStore().count).toBe(0);
    });

    it('calling increment increases the value of count', () => {
        const store = new CounterStore();
        
        store.increment();

        expect(store.count).toBe(1);
    });
});
