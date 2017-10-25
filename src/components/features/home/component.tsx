import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export const HomePage: React.SFC<RouteComponentProps<{}>> = _props => (
    <h3>Welcome to Hours!</h3>
);