import { homePath, HomePage } from '../features/home';
import { worldPath, WorldPage } from '../features/world';
import { londonPath, LondonPage } from '../features/london';
import { brightonPath, BrightonPage } from '../features/brighton';
import { funnyPath, FunnyPage } from '../features/funny';
import { webdevPath, WebDevPage } from '../features/webdev';

export const publicRoutes = [
    { path: homePath, component: HomePage, exact: true },
    { path: worldPath, component: WorldPage, exact: true },
    { path: londonPath, component: LondonPage, exact: true },
    { path: brightonPath, component: BrightonPage, exact: true },
    { path: funnyPath, component: FunnyPage, exact: true },
    { path: webdevPath, component: WebDevPage, exact: true },
];
