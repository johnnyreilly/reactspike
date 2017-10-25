import { FxRatesStore } from '../fxRatesStore';
import { Api } from '../../../api/index';
import { IFxRates } from '../../../api/fixer';

describe('fxRatesStore', () => {
    it('initial lastLoaded should be undefined', () => {
        const mockApi = new Api(undefined);

        const fxRatesStore = new FxRatesStore(mockApi);

        expect(fxRatesStore.lastLoaded).toBe(undefined);
    });

    it('given loadRates has completed with success lastLoaded should be rates', async () => {
        const mockApi = new Api(undefined);
        const rates = {
            base: 'base',
            date: '2012-05-15',
            rates: {
                'EURUSD': 1.5
            }
        };
        mockApi.fixer.getLatestRates = jest.fn(() => Promise.resolve<IFxRates>(rates));
        const fxRatesStore = new FxRatesStore(mockApi);

        await fxRatesStore.loadRates();

        expect(fxRatesStore.lastLoaded).toBe('rates');
        expect(fxRatesStore.rates.isRequesting).toBe(false);
        expect(fxRatesStore.rates.response).toBe(rates);
        expect(fxRatesStore.rates.error).toBe(undefined);
    });

    it('given loadRates has completed with error lastLoaded should be undefined', async () => {
        const mockApi = new Api(undefined);
        const error = 'bad tings a gwan';
        mockApi.fixer.getLatestRates = jest.fn(() => Promise.reject(error));
        const fxRatesStore = new FxRatesStore(mockApi);

        await fxRatesStore.loadRates();

        expect(fxRatesStore.lastLoaded).toBe(undefined);
        expect(fxRatesStore.rates.isRequesting).toBe(false);
        expect(fxRatesStore.rates.response).toBe(undefined);
        expect(fxRatesStore.rates.error).toBe(error);
    });
});
