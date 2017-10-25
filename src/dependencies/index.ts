import * as mobx from 'mobx';
import { Api } from '../api';
import { Config } from '../config';
import { StorageFacade } from './storageFacade';
import { CounterStore } from './stores/counterStore';
import { FxRatesStore } from './stores/fxRatesStore';
import { HourStore } from './stores/hourStore';
import { ListerStore } from './stores/listerStore';
import { SecurityStore } from './stores/securityStore';

mobx.useStrict(true); // Use to prevent mysterious issues creeping in https://github.com/mobxjs/mobx/blob/gh-pages/docs/refguide/api.md#usestrict

export class Dependencies {
    fxRatesStore: FxRatesStore;
    lister1Store: ListerStore;
    lister2Store: ListerStore;
    counterStore: CounterStore;
    hourStore: HourStore;
    securityStore: SecurityStore;

    constructor(
        public api: Api,
        public config: Config,
        public storage: StorageFacade
    ) {
        this.fxRatesStore = new FxRatesStore(api);
        this.lister1Store = new ListerStore();
        this.lister2Store = new ListerStore();
        this.counterStore = new CounterStore();
        this.hourStore = new HourStore();
        this.securityStore = new SecurityStore(api, storage);
    }
}
