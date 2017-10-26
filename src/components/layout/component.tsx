import * as React from 'react';
import {
    withRouter,
    Route,
    RouteComponentProps,
    Switch
} from 'react-router-dom';
import { publicRoutes } from './routes';
import { NotFound } from '../shared/notFound';

interface ILayoutProps extends RouteComponentProps<{}> {
}

@withRouter
export class Layout extends React.Component<Partial<ILayoutProps>> {

    render() {
        return (
            <Switch key="main">
                {publicRoutes.map(({ path, component, exact }) => (
                    <Route key={path} exact={exact} path={path} component={component} />
                ))}
                <Route component={NotFound} />
            </Switch>
        );
    }
}
