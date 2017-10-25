import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export const Topic: React.SFC<RouteComponentProps<{ topicId: string; }>> = ({ match }) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);
