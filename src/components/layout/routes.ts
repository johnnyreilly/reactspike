import { homePath, HomePage } from '../features/home';

export const publicRoutes = [
    { path: homePath, component: HomePage, exact: true },
];
