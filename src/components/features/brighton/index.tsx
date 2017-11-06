import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SpikePage, ISpikeProps } from '../../shared/spike';

const spikeConfig: ISpikeProps = require('../../../spike-configs/brighton.json');

export const BrightonPage: React.SFC<RouteComponentProps<{}>> = _props => (
  <SpikePage {...spikeConfig} />
);

export const brightonPath = '/brighton';
