import * as React from 'react';
import {
    withRouter,
    Route,
    RouteComponentProps,
    Switch
} from 'react-router-dom';
import { Header } from './header';
import { publicRoutes } from './routes';
import { NotFound } from '../shared/notFound';
import { Footer } from './footer';

interface ILayoutProps extends RouteComponentProps<{}> {
}

@withRouter
export class Layout extends React.Component<Partial<ILayoutProps>> {

    renderRoute = ({ path, component, exact }: { path: string; exact?: boolean; component: React.ComponentType<RouteComponentProps<any> | {}> }) => (
        <Route key={path} exact={exact} path={path} component={component} />
    )

    render() {
        const { location } = this.props;

        return [
            <Header key="head" />,
            <Switch key="main">
                {publicRoutes.map(this.renderRoute)}
                <Route component={NotFound} />
            </Switch>,
            <Footer key="footer" spikeName={location.pathname} />
        ];
    }
}
