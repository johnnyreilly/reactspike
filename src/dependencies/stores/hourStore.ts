import { observable, action } from 'mobx';

const STORAGE_KEY = 'HOURS_2012-06-15T11:37:00.000Z'; // Value is not significant; just want it to be unique

interface IHourProps {
  lastSavedAt: string;
}

export class HourStore implements IHourProps {
  @observable.ref count: number = 0;
  @observable.ref lastSavedAt: string = undefined;
  
  @action save() {
    this.lastSavedAt = new Date().toISOString();

    const data: IHourProps = {
      lastSavedAt: this.lastSavedAt
    };
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  @action load() {
    const storedData: Readonly<IHourProps> = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    this.lastSavedAt = storedData.lastSavedAt;
    this.count++;
  }
}
