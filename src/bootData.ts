import { ISpike } from '../src-feed-reader/interfaces';

let _bootData: ISpike;

export const getBootData = (url: string) => {
    if (`/${_bootData.spikeShortName}` === url) {
        return _bootData;
    }
    return undefined;
};

export const setBootData = (bootData: ISpike) => _bootData = bootData;