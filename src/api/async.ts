import { observable, action } from 'mobx';

/**
 * Will typically be used in react components
 */
export interface IAsyncProps<TResponse> {
    isRequesting: boolean;
    response?: TResponse;
    error?: string;
}

/**
 * Models an Async request / response - all the properties exposed are
 * decorated with `observable.ref`; i.e. they are immutable
 */
class Async<TRequest, TResponse> implements IAsyncProps<TResponse> {
    /**
     * Whether a request is in process
     */
    @observable.ref isRequesting: boolean = false;

    /**
     * (optional) The response received last time a request was run
     */
    @observable.ref response?: TResponse = undefined;

    /**
     * (optional) The error received last time a request was run
     */
    @observable.ref error?: string = undefined;

    constructor(private process: (request: TRequest) => Promise<TResponse>) {

    }

    @action
    async run(request?: TRequest) {
        try {
            this.isRequesting = true;
            this.response = undefined;
            this.error = undefined;

            const response = await this.process(request);
            this.runSuccess(response);
        } catch (error) {
            this.runError(error);
        }
    }

    @action private runSuccess(response: TResponse) {
        this.response = response;
        this.isRequesting = false;
    }

    @action private runError(error: any) {
        this.error = error.message ? error.message : error;
        this.isRequesting = false;
    }

    @action
    reset() {
        this.isRequesting = false;
        this.response = undefined;
        this.error = undefined;
        return this;
    }
}

/**
 * Allows user to create an Async - exposed like this to express immutability to consumers
 */
export const observableAsync = <TRequest, TResponse>(process: (request: TRequest) => Promise<TResponse>) =>
    new Async(process);
