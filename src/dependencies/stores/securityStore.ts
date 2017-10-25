import { observable, action, computed } from 'mobx';
import { observableAsync } from '../../api/async';
import { Api } from '../../api/index';
import { ILogin } from '../../api/security';
import { StorageFacade } from '../storageFacade';

export const USER_ID = 'userId';

export class SecurityStore {
  @observable.ref userId: string = null;

  loginResult = observableAsync(this.api.security.createToken);

  @computed get isLoggedIn() {
    return !!this.userId;
  }

  constructor(private api: Api, private storage: StorageFacade) {
  }

  onStorageChanged = (event: StorageEvent) => {
    if (event.key === USER_ID) {
      this.setUserId(event.newValue);
    }
  }

  initialise() {
    const userId = this.storage.getItem(USER_ID);
    if (userId) {
      this.setUserId(userId);
    }
    this.storage.addEventListener(this.onStorageChanged);
  }

  @action setUserId(userId: string) {
    this.userId = userId;
  }

  @action async login(login: ILogin) {
    await this.loginResult.run(login);
    const { response } = this.loginResult;
    if (response) {
      this.setUserId(response.userId);
      this.storage.setItem(USER_ID, this.userId);
    }
  }

  @action logout() {
    this.loginResult.reset();
    this.userId = null;
    this.storage.removeItem(USER_ID);
  }
}