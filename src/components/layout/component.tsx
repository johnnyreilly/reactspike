import * as React from 'react';
import {
    withRouter,
    Route,
    RouteComponentProps,
    Switch
} from 'react-router-dom';
import { NotFound } from '../shared/notFound';
import { SpikePage } from '../shared/spike';

interface ILayoutProps extends RouteComponentProps<{}> {
}

@withRouter
export class Layout extends React.Component<Partial<ILayoutProps>> {

    render() {
        return (
            <Switch key="main">
                <Route path="/" exact={true} component={SpikePage}/>
                <Route path="/:spikeName" exact={true} component={SpikePage}/>
                <Route component={NotFound} />
            </Switch>
        );
    }
}
