import * as React from 'react';
import {
    withRouter,
    Route,
    RouteComponentProps,
    Switch
} from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import { Header } from './header';
import { publicRoutes } from './routes';
import { NotFound } from '../shared/notFound';
import { Dependencies } from '../../dependencies/index';
import { Config } from '../../config';

interface ILayoutProps extends RouteComponentProps<{}> {
    config: Config;
}

@withRouter
@inject((dependencies: Dependencies) => ({
    config: dependencies.config
}))
@observer
export class Layout extends React.Component<Partial<ILayoutProps>> {

    renderRoute = ({ path, component, exact }: { path: string; exact?: boolean; component: React.ComponentType<RouteComponentProps<any> | {}> }) => (
        <Route key={path} exact={exact} path={path} component={component} />
    )

    render() {
        const { config } = this.props;
        return [
            <Header key="head" />,
            <main key="main" className="container section" role="main">
                <Switch>
                    {publicRoutes.map(this.renderRoute)}
                    <Route component={NotFound} />
                </Switch>
            </main>,
            ...config.development ? [<DevTools key="devtools" />] : []
        ];
    }
}
