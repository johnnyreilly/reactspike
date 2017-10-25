import * as React from 'react';
import {
    withRouter
} from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';

interface IHeaderProps extends RouteComponentProps<{}> {
}

@withRouter
@observer
export class Header extends React.Component<Partial<IHeaderProps>> {
/*
    publicLinks = [
        { path: homePath, title: 'Home' },
        { path: dataPath, title: 'Data' },
        { path: fxRatesPath, title: 'FX Rates' },
        { path: aboutPath, title: 'About' },
    ];

    renderLink({ path, title }: { path: string, title: string }) {
        return (
            <Menu.Item key={path} active={this.props.location.pathname === path}>
                <Link key={path} to={path}>{title}</Link>
            </Menu.Item>
        );
    }
*/
    render() {
        return (
            <header className="main-header">

                <a href="" className="logo-link" target="_self">
                    <svg className="logo-readspike" style={{ fill: '#fff' }}>><use xlinkHref="#logo_readspike" /></svg>

                    Readspike <span style={{ color: '#fff' }}></span>

                </a>

                <h1 className="logo-header">Readspike - Simple news aggregator</h1>

                <nav className="main-nav" role="navigation">
                    <input type="checkbox" className="main-nav__checkbox" id="toggle-nav" />
                    <label htmlFor="toggle-nav" className="main-nav__label">
                        <svg className="icon main-nav__close"><use xlinkHref="#icon_x" /></svg>
                        <svg className="icon main-nav__open"><use xlinkHref="#icon_arrow" /></svg>
                        Show menu
                        </label>
                    <ul className="main-nav__items">
                        <li><a href="" className="s-home" target="_self">Home</a></li>
                        <li><a href="world" className="s-world" target="_self">World</a></li>
                        <li><a href="london" className="s-london" target="_self">London</a></li>
                        <li><a href="brighton" className="s-brighton" target="_self">Brighton</a></li>
                        <li><a href="funny" className="s-funny" target="_self">Funny</a></li>
                        <li><a href="webdev" className="s-webdev" target="_self">WebDev</a></li>
                        <li><a href="contact" className="s-home" target="_self">Feedback</a></li>
                    </ul>
                </nav>

            </header>
        );
    }
}