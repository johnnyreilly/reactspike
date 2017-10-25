import { ajaxUnwrapIApiResult } from './ajax';
import { Config } from '../config';

export interface ILoginResultView {
    userId: string;
    cookie: ICookieView;
}

export interface ICookieView {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: string;
    isSecure: boolean;
}

export interface ILogin {
    username: string;
    password: string;
}

export interface ILoginResult {
    cookie: string;
    domain: string;
    expiry: number;
}

export interface ISecurityUser {
    userId: string;
}

export class SecurityApi {
    constructor(private config: Config) { }

    createToken = (login: ILogin) =>
        ajaxUnwrapIApiResult<ILoginResultView>(`${this.config.loginApiBaseUrl}/api/token`, {
            method: 'POST',
            body: JSON.stringify(login)
        })

    me = () =>
        ajaxUnwrapIApiResult<ISecurityUser>(`${this.config.apiBaseUrl}/api/users/me`)
}
