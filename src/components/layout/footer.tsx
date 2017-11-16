import * as React from 'react';

interface IFooterProps {
    autoRefresh: boolean;
    setAutoRefresh: (autoRefresh: boolean) => void;
    spikeName: string;
    generatedAt: string;
}

export class Footer extends React.Component<IFooterProps> {
    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.props.setAutoRefresh(event.target.checked)

    render() {
        return (
            <footer className="page-footer">

                <a href="https://twitter.com/readspike" className="logo-link">
                    <svg className="logo-readspike"><use xlinkHref="#logo_readspike" /></svg>
                    {this.props.spikeName}
                </a>

                <span>Feeds last read at: {this.props.generatedAt}</span>

                <label htmlFor="autoRefresh" className="checkbox-label">
                    <input type="checkbox" name="autoRefresh" id="autoRefresh" checked={this.props.autoRefresh} onChange={this.handleInputChange} />
                    Auto-refresh
                </label>

                <label htmlFor="sinister" className="checkbox-label">
                    <input type="checkbox" name="sinister" id="sinister" />
                    Toggle left handed mode
                </label>

                <a href="https://blackspike.com/" className="colofon">Made by Blackspike</a>

                {/* <a href="#top" className="back-to-top" target="_self"><svg className="icon"><use xlinkHref="#icon_arrow" /></svg></a> */}

            </footer>
        );
    }
}