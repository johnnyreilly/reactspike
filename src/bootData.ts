import { ISpike } from '../src-feed-reader/interfaces';

let _bootData: ISpike;
export const getBootData = () => _bootData;

export const setBootData = (bootData: ISpike) => _bootData = bootData;