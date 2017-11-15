import { ISpike } from '../src-feed-reader/interfaces';

let _bootData: ISpike;

export function getBootSpikeData(url: string) {
    if (_bootData && _bootData.spikeShortName === url) {
        return _bootData;
    }
    return undefined;
}

export function setBootSpikeData(bootSpikeData: ISpike) {
    _bootData = bootSpikeData;
}

export async function getSpikeDataBrowser(spikeName: string) {
    const jsonRequired = (spikeName || 'home') + '.json';
    const response = await fetch(jsonRequired);
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const json: ISpike = await response.json();
        return json;
    }
    throw new TypeError(`Oops, we haven't got JSON from ${jsonRequired}!`);
}
