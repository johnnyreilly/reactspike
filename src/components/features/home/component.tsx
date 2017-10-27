import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SpikePage } from '../../shared/spike';
import { spikeConfig } from './config';

export const HomePage: React.SFC<RouteComponentProps<{}>> = _props => (
  <SpikePage
    spikeName={spikeConfig.spikeName}
    spikeShortName={spikeConfig.spikeShortName}
    spikeURL={spikeConfig.spikeURL}
    spikeTitle={spikeConfig.spikeTitle}
    spikeBodyBG={spikeConfig.spikeBodyBG}
    spikeHeaderBG={spikeConfig.spikeHeaderBG}
    spikeDescription={spikeConfig.spikeDescription}
    sectionConfig={spikeConfig.sectionConfig}
  />
);