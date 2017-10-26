import * as React from 'react';
import { Section } from './section';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

export interface IConfig {
  name: string;
  title: string;
  type: string;
  col: string;
  row: string;
  mob: string;
  color: string;
  url: string;
  feed: string;
}

interface ISpikeProps {
  spikeName: string;
  spikeShortName: string;
  spikeURL: string;
  config: IConfig[];
}

export const SpikePage: React.SFC<ISpikeProps> = ({ config, spikeName, spikeShortName }) => {
  const col1s = config.filter(item => item.col === '1');
  const col2s = config.filter(item => item.col === '2');
  const col3s = config.filter(item => item.col === '3');
  const allCols = [col1s, col2s, col3s];

  return [
    <Header key="head" />,
    <main key="main" className="col-group">
      {allCols.map(col => (
        <div className="col">
          {col.map(item => (
            <Section
              itemName={item.name}
              itemColor={item.color}
              itemURL={`https://readspike.com/cache_renders/rendered_${item.name}.php`}
              itemTitle={item.title}
              itemRow={item.row}
              spikeShortName={spikeShortName}
            />
          ))}
        </div>
      ))}
    </main>,
    <Footer key="footer" spikeName={spikeName} />
  ] as any; // HACK UNTIL THIS IS RESOLVED: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20356#issuecomment-336384210
};