import { ajax, jsonHeaders } from './ajax';

export interface IFxRates {
    base: string;
    date: string;
    rates: { [ccy: string]: number };
}

export class FixerApi {
    getLatestRates = () =>
        ajax<IFxRates>('https://api.fixer.io/latest')

    getRatesForDate = (date: string) =>
        ajax<IFxRates>('https://api.fixer.io/' + date)

    // Not a real method - in place to demostrate how saves might be done
    saveRates = (rate: IFxRates) =>
        ajax<IFxRates>('https://api.fixer.io/', { headers: jsonHeaders, method: 'POST', body: JSON.stringify(rate) })
}
