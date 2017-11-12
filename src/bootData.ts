import { ISpike } from '../src-feed-reader/interfaces';

let _bootData: ISpike;

export const getBootData = (url: string) => {
    if (_bootData.spikeShortName === url) {
        return _bootData;
    }
    return undefined;
};

export const setBootData = (bootData: ISpike) => _bootData = bootData;

export async function getJson(spikeName: string) {
    const jsonRequired = (spikeName || 'home') + '.json';
    const response = await fetch(jsonRequired);
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const json: ISpike = await response.json();
        return json;
    }
    throw new TypeError(`Oops, we haven't got JSON from ${jsonRequired}!`);
}
