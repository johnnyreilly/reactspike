import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SpikePage } from '../../shared/spike';
import { ISpike } from '../../../../src-feed-reader/interfaces';

const spikeConfig: ISpike = require('../../../spike-configs/funny.json');

export const FunnyPage: React.SFC<RouteComponentProps<{}>> = _props => (
  <SpikePage {...spikeConfig} />
);

export const funnyPath = '/funny';
