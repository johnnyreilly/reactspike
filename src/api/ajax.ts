
export const jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export async function ajax<TResponse extends {}, TMappedResponse = TResponse>(
    input: RequestInfo,
    init?: RequestInit,
    transformer?: (data: TResponse) => TMappedResponse
) {
    try {
        const response = await fetch(input, {
            ...init,
            headers: {
                ...jsonHeaders,
                ...(init === undefined ? undefined : init.headers)
            },
        });
        const validResponse = await status(response);
        const responseJson = await json<TResponse>(validResponse);

        const data = transformer === undefined
            ? responseJson
            : transformer(responseJson);
        return data;
    } catch (error) {
        throw error;
    }
}
export interface IApiResult<TData extends {}, TMeta = {}> {
    data: TData;
    meta: TMeta;
}

export function unwrapIApiResult<TData extends {}>(data: IApiResult<TData>) {
    return data.data;
}

/**
 * Most of the time we're only interested in the `data` of an `IApiResult`; this is a simpler function for that end
 */
export function ajaxUnwrapIApiResult<TResponse>(
    input: RequestInfo,
    init?: RequestInit,
) {
    const request = ajax<IApiResult<TResponse>, TResponse>(input, init, unwrapIApiResult) as Promise<TResponse>;
    return request;
}

async function status(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    throw new Error(response.statusText);
}

export function json<TData>(response: Response) {
    return response.json() as Promise<TData>;
}
