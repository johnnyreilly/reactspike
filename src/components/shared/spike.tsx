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

interface IState {
  autoRefresh: boolean;
}

const AUTOREFRESH = 'autoRefresh';

export class SpikePage extends React.Component<ISpikeProps, IState> {
  state = {
    autoRefresh: window.localStorage.getItem(AUTOREFRESH) === 'true'
  };

  setAutoRefresh = (autoRefresh: boolean) => {
    window.localStorage.setItem(AUTOREFRESH, autoRefresh ? 'true' : 'false');
    this.setState(_prevState => ({ autoRefresh }));
  }

  render() {
    const { config, spikeName, spikeShortName } = this.props;
    const col1s = config.filter(item => item.col === '1');
    const col2s = config.filter(item => item.col === '2');
    const col3s = config.filter(item => item.col === '3');
    const allCols = [col1s, col2s, col3s];

    return [
      <Header key="head" />,
      <main key="main" className="col-group">
        {allCols.map((col, index) => (
          <div key={index} className="col">
            {col.map(item => (
              <Section
                key={item.name}
                itemName={item.name}
                itemColor={item.color}
                itemUrl={item.url}
                itemTitle={item.title}
                itemRow={item.row}
                itemHtmlUrl={`https://readspike.com/cache_renders/rendered_${item.name}.php`}
                spikeShortName={spikeShortName}
                autoRefresh={this.state.autoRefresh}
              />
            ))}
          </div>
        ))}
      </main>,
      <Footer key="footer" spikeName={spikeName} autoRefresh={this.state.autoRefresh} setAutoRefresh={this.setAutoRefresh} />
    ];
  }
}