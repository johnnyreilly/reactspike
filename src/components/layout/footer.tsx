import * as React from 'react';

interface IFooterProps {
    spikeName: string;
}

export const Footer: React.SFC<IFooterProps> = ({ spikeName }) => (
    <footer className="page-footer">

    <a href="https://twitter.com/readspike" className="logo-link">
        <svg className="logo-readspike"><use xlinkHref="#logo_readspike" /></svg>
        {spikeName}
    </a>

    <label htmlFor="sinister" className="checkbox-label">
    <input type="checkbox" name="sinister" id="sinister" />
        Toggle left handed mode
    </label>

    <a href="https://blackspike.com/" className="colofon">Made by Blackspike</a>

    {/* <a href="#top" className="back-to-top" target="_self"><svg className="icon"><use xlinkHref="#icon_arrow" /></svg></a> */}

    </footer>
);