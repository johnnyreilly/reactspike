import { homePath, HomePage } from '../features/home';
import { worldPath, WorldPage } from '../features/world';
import { brightonPath, BrightonPage } from '../features/brighton';

export const publicRoutes = [
    { path: homePath, component: HomePage, exact: true },
    { path: worldPath, component: WorldPage, exact: true },
    { path: brightonPath, component: BrightonPage, exact: true },
];
