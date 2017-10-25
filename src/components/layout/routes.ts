import { fxRatesPath, FxRatesPage } from '../features/fxRates';
import { aboutPath, AboutPage } from '../features/about';
import { homePath, HomePage } from '../features/home';
import { dataPath , DataPage } from '../features/data';
import { spikePath, SpikePage } from '../features/spike';

export const publicRoutes = [
    { path: spikePath, component: SpikePage, exact: true },
    { path: homePath, component: HomePage, exact: true },
    { path: dataPath, component: DataPage, exact: true },
    { path: fxRatesPath, component: FxRatesPage, exact: true },
    { path: aboutPath, component: AboutPage, exact: true }
];
