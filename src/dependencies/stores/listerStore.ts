import { observable, action } from 'mobx';

export class ListerStore {
  @observable list: string[] = [];

  @action add(value: string) {
      this.list.push(value);
  }
}
