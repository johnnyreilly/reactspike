import { observable, action } from 'mobx';
import { observableAsync } from '../../api/async';
import { Api } from '../../api/index';

type LastLoaded = 'rates' | 'ratesForDate';

export class FxRatesStore {
  @observable.ref lastLoaded: LastLoaded = undefined;

  rates = observableAsync(this.api.fixer.getLatestRates);

  ratesForDate = observableAsync(this.api.fixer.getRatesForDate);

  constructor(private api: Api) { }

  @action setLastLoaded(lastLoaded: LastLoaded) {
    this.lastLoaded = lastLoaded;
  }

  @action async loadRates() {
    await this.rates.run();
    if (this.rates.response) {
      this.setLastLoaded('rates');
    }
  }

  @action async loadRatesForDate(date: string) {
    await this.ratesForDate.run(date);
    if (this.ratesForDate.response) {
      this.setLastLoaded('ratesForDate');
    }
  }
}