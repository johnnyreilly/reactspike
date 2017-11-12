import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './app';
import registerServiceWorker from './registerServiceWorker';
import { getJson, setBootData } from './bootData';
import './styles/main.scss';

/**
 * Render the app
 */
function render(AppComponent: React.SFC) {
    const rootEl = document.getElementById('root');
    ReactDOM.hydrate(
        <Router>
            <AppComponent />
        </Router>,
        rootEl
    );
}

function boot() {
    const trimmedPath = window.location.pathname.substr(1);
    getJson(trimmedPath).then(spike => {
        setBootData(spike);
        render(App);
    }).catch(error => {
        // tslint:disable-next-line:no-console
        console.error(error);
    });
}

boot();
registerServiceWorker();
