import * as React from 'react';
import { Section } from './section';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

export interface ISectionConfig {
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

export interface ISpikeProps {
  spikeName: string;
  spikeShortName: string;
  spikeURL: string;
  spikeTitle: string;
  spikeDescription: string;
  spikeHeaderBG: string;
  spikeBodyBG: string;

  sectionConfig: ISectionConfig[];
}

interface IState {
  autoRefresh: boolean;
}

const AUTOREFRESH = 'autoRefresh';

export class SpikePage extends React.Component<ISpikeProps, IState> {
  state = {
    autoRefresh: window.localStorage.getItem(AUTOREFRESH) === 'true'
  } as IState;

  setAutoRefresh = (autoRefresh: boolean) => {
    window.localStorage.setItem(AUTOREFRESH, autoRefresh ? 'true' : 'false');
    this.setState(_prevState => ({ autoRefresh }));
  }

  render() {
    const { spikeName, spikeShortName, spikeURL, spikeHeaderBG, spikeTitle, sectionConfig } = this.props;
    const col1s = sectionConfig.filter(item => item.col === '1');
    const col2s = sectionConfig.filter(item => item.col === '2');
    const col3s = sectionConfig.filter(item => item.col === '3');
    const allCols = [col1s, col2s, col3s];

    return [
      <Header
        key="head"
        spikeName={spikeName}
        spikeShortName={spikeShortName}
        spikeTitle={spikeTitle}
        spikeHeaderBG={spikeHeaderBG}
        spikeURL={spikeURL}
      />,
      <main key="main" className="col-group">
        {allCols.map((col, index) => (
          <div key={index} className="col">
            {col.map(item => (
              <Section
                key={item.name}
                itemName={item.name}
                itemColor={item.color}
                itemUrl={spikeURL}
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