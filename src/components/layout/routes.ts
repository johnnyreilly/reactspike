import { homePath, HomePage } from '../features/home';
import { worldPath, WorldPage } from '../features/world';

export const publicRoutes = [
    { path: homePath, component: HomePage, exact: true },
    { path: worldPath, component: WorldPage, exact: true },
];
