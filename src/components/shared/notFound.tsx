import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export const NotFound: React.SFC<RouteComponentProps<{}>> = ({ location }) => (
    <div>
      <h3>So you tried to go to this location: <code>{location.pathname}</code>. I'm afraid I don't know where that is..</h3>
    </div>
  );
  