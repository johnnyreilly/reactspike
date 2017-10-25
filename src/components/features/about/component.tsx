import * as React from 'react';
import { Counter } from './counter/component';

export class AboutPage extends React.Component {
    render() {
        return (
            <div>
                <h2>About</h2>
                <Counter />
            </div>
        );
    }
}
