import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { App } from './app';
import './styles/main.scss';

/**
 * Render the app
 */
function render(Component: React.SFC) {
    const rootEl = document.getElementById('top');
    ReactDOM.render(
        <AppContainer>
            <Router>
                <Component />
            </Router>
        </AppContainer>,
        rootEl
    );
}

render(App);

// Hot Module Replacement API
if ((module as any).hot) {
    (module as any).hot.accept('./app', () => {
        const makeNextApp = require('./app').default;
        const nextApp = makeNextApp(['app']);
        render(nextApp);
    });
}
