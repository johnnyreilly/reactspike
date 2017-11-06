import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SpikePage, ISpikeProps } from '../../shared/spike';

const spikeConfig: ISpikeProps = require('../../../spike-configs/home.json');

export const HomePage: React.SFC<RouteComponentProps<{}>> = _props => (
  <SpikePage {...spikeConfig} />
);