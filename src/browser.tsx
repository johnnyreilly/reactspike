import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './app';
import registerServiceWorker from './registerServiceWorker';
import { setBootSpikeData, getSpikeDataBrowser } from './bootData';
import './styles/main.scss';

function render(AppComponent: React.SFC) {
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
    try {
        const spike = await getSpikeDataBrowser(trimmedPath);
        setBootSpikeData(spike);
        render(App);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(error);
    }
}

boot();
registerServiceWorker();
