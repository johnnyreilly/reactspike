// tslint:disable:max-line-length
// tslint:disable:quotemark
import * as React from 'react';
import { Link } from 'react-router-dom';

interface IHeaderProps {
    spikeHeaderBG: string;
    spikeUrl: string;
    spikeTitle: string;
    spikeShortName: string;
    spikeName: string;
    menuOpen: boolean;
    loading: boolean;
    toggleMenu: () => void;
}

export class Header extends React.Component<IHeaderProps> {
    menuOpenOrClose = (_event: React.ChangeEvent<HTMLInputElement>) =>
        this.props.toggleMenu()

    publicLinks = [
        { path: '/', className: 's-home', title: 'Home' },
        { path: '/world', className: 's-world', title: 'World' },
        { path: '/london', className: 's-london', title: 'London' },
        { path: '/brighton', className: 's-brighton', title: 'Brighton' },
        { path: '/funny', className: 's-funny', title: 'Funny' },
        { path: '/webdev', className: 's-webdev', title: 'WebDev' },
        // { path: homePath, className: 's-home', title: 'Feedback' },
    ];

    render() {
        const { spikeHeaderBG, spikeUrl, spikeShortName, spikeTitle, spikeName } = this.props;
        return (
            <header className="main-header">

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "http://schema.org",
                            "@type": "Organization",
                            "url": spikeUrl,
                            "logo": "https://readspike.com/assets/img/readspike_logo_1200x630.png",
                            "sameAs": "https://twitter.com/readspike"
                        })
                    }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                    <symbol id="icon_x" viewBox="0 0 18 18">
                        <title>Close x</title>
                        <polygon points="16.43 3.7 14.3 1.57 9 6.88 3.7 1.57 1.57 3.7 6.88 9 1.57 14.3 3.7 16.43 9 11.12 14.3 16.43 16.43 14.3 11.12 9 16.43 3.7" />
                    </symbol>
                    <symbol id="icon_comment" viewBox="0 0 22 22">
                        <title>Comment icon</title>
                        <path d="M0,13.58c2.58-.09,3.94-1.81,3.8-4.34H0V2H7.15V9.28c0,4.57-2.71,6.56-7.15,6.87Zm10.86,0c2.58-.09,3.93-1.81,3.8-4.34h-3.8V2H18V9.28c0,4.57-2.71,6.56-7.14,6.87Z" />
                    </symbol>
                    <symbol id="icon_arrow" viewBox="0 0 18 18">
                        <title>Open arrow</title>
                        <polygon points="8.43 13.77 15.85 6.35 13.73 4.23 8.43 9.53 3.12 4.23 1 6.35 8.43 13.77" />
                    </symbol>
                    <symbol id="logo_readspike" viewBox="0 0 16 16">
                        <title>Readspike logo</title>
                        <path d="M8,16,5.17,12.21,2.89,8V2.25L8,0l5.14,2.25V8L10.78,12.3ZM6.73,10.7,8,12.39,9.27,10.7l1.67-3.06v-4L8,2.39,5.06,3.68v4Z" />
                    </symbol>
                </svg>

                <a href="/" className="logo-link" target="_self">
                    <svg className="logo-readspike" style={{ fill: spikeHeaderBG }}>><use xlinkHref="#logo_readspike" /></svg>

                    Readspike <span style={{ color: spikeHeaderBG }}>{spikeShortName}</span>

                </a>

                <h1 className="logo-header">{spikeName} - {spikeTitle}</h1>

                {this.props.loading ? <svg className="loading-icon icon-spin"><use xlinkHref="#logo_readspike" /></svg> : null}

                <nav className="main-nav" role="navigation">
                    <input
                        type="checkbox"
                        className="main-nav__checkbox"
                        id="toggle-nav"
                        checked={this.props.menuOpen}
                        onChange={this.menuOpenOrClose}
                    />
                    <label htmlFor="toggle-nav" className="main-nav__label">
                        <svg className="icon main-nav__close"><use xlinkHref="#icon_x" /></svg>
                        <svg className="icon main-nav__open"><use xlinkHref="#icon_arrow" /></svg>
                        Show menu
                    </label>
                    <ul className="main-nav__items">
                        {this.publicLinks.map(({ path, title, className }) => (
                            <li key={title}>
                                <Link to={path} className={className}>{title}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

            </header>
        );
    }
}