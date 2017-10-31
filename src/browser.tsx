import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './app';
import registerServiceWorker from './registerServiceWorker';
import './styles/main.scss';

/**
 * Render the app
 */
function render(Component: React.SFC) {
    const rootEl = document.getElementById('root');
    ReactDOM.hydrate(
        <Router>
            <Component />
        </Router>,
        rootEl
    );
}

render(App);
registerServiceWorker();
