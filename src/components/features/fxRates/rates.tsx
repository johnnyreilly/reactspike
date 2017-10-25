import * as React from 'react';
import { IFxRates } from '../../../api/fixer';
import { IAsyncProps } from '../../../api/async';

export const Rates: React.SFC<IAsyncProps<IFxRates>> = ({ error, response }) => (
    <div>
        {response
            ? <div>
                Base: {response.base}
                Date: {response.date}
                <ul>
                    {Object.keys(response.rates).map(ccy =>
                        <li key={ccy}>{ccy}: {response.rates[ccy]}</li>)}
                </ul>
            </div>
            : null}
        {error ? <div>There was a problem: {error}</div> : null}

    </div>
);
