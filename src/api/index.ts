import { FixerApi } from './fixer';
import { SecurityApi } from './security';
import { Config } from '../config';

export class Api {
    readonly fixer: FixerApi;
    readonly security: SecurityApi;

    constructor(config: Config) { 
        this.fixer = new FixerApi();
        this.security = new SecurityApi(config);
    }
}
