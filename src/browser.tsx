import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ISpike } from '../src-feed-reader/interfaces';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './app';
import registerServiceWorker from './registerServiceWorker';
import './styles/main.scss';

/**
 * Render the app
 */
function render(AppComponent: React.SFC, _spike: ISpike) {
    const rootEl = document.getElementById('root');
    ReactDOM.hydrate(
        <Router>
            <AppComponent />
        </Router>,
        rootEl
    );
}

async function boot() {
    const trimmedPath = window.location.pathname.substr(1);
    const jsonRequired = (trimmedPath || 'home') + '.json';
    try {
        const response = await fetch(jsonRequired);
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const json: ISpike = await response.json();
            render(App, json);
        }
        throw new TypeError(`Oops, we haven't got JSON from {jsonRequired}!`);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(error);
    }
}

boot();
registerServiceWorker();
