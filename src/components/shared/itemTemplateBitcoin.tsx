import * as React from 'react';
import { ISectionDataBitcoin } from '../../../src-feed-reader/interfaces';

export const ItemTemplateBitcoin: React.SFC<ISectionDataBitcoin> = ({ amount, code, symbol }) => {
    const [beforeTheDecimal, andAfter] = amount.split('.');
    return (
        <li key={code} className={`bitcoin-row bitcoin-row--${code}`} data-code={code}>
            <span className="bitcoin-price">
                <span dangerouslySetInnerHTML={{ __html: symbol }}></span>{beforeTheDecimal}<span className="decimal">{andAfter}</span>
            </span>
        </li>
    );
};
