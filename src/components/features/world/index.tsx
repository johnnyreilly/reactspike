import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SpikePage, ISpikeProps } from '../../shared/spike';

const spikeConfig: ISpikeProps = require('../../../spike-configs/world.json');

export const WorldPage: React.SFC<RouteComponentProps<{}>> = _props => (
  <SpikePage {...spikeConfig} />
);

export const worldPath = '/world';
