import * as React from 'react';
import { Section } from './section';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';
import { canUseDOM } from '../../canUseDOM';

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
  spikeUrl: string;
  spikeTitle: string;
  spikeDescription: string;
  spikeHeaderBG: string;
  spikeBodyBG: string;

  sectionConfig: ISectionConfig[];
}

interface IState {
  autoRefresh: boolean;
  moreOrLessChecked: { [sectionUrl: string]: boolean };
}

const AUTOREFRESH = 'autoRefresh';

export class SpikePage extends React.Component<ISpikeProps, IState> {
  constructor(props: ISpikeProps) {
    super(props);
    this.state = {
      autoRefresh: canUseDOM ? window.localStorage.getItem(AUTOREFRESH) === 'true' : false,
      moreOrLessChecked: canUseDOM 
        ? JSON.parse(window.localStorage.getItem(`${this.props.spikeUrl}_moreOrLessChecked`) || '{}')
        : {}
    };
}

setAutoRefresh = (autoRefresh: boolean) => {
  window.localStorage.setItem(AUTOREFRESH, autoRefresh ? 'true' : 'false');
  this.setState(_prevState => ({ autoRefresh }));
}

setMoreOrLessChecked = (sectionUrl: string, moreOrLessChecked: boolean) => {
  const allMoreOrLessChecked = Object.assign({ [sectionUrl]: moreOrLessChecked }, this.state.moreOrLessChecked);
  window.localStorage.setItem(`${this.props.spikeUrl}_moreOrLessChecked`, JSON.stringify(allMoreOrLessChecked));
  this.setState(_prevState => ({ moreOrLessChecked: allMoreOrLessChecked }));
}

render() {
    const { spikeName, spikeShortName, spikeUrl, spikeHeaderBG, spikeTitle } = this.props;
    const col1s = this.props.sectionConfig.filter(section => section.col === '1');
    const col2s = this.props.sectionConfig.filter(section => section.col === '2');
    const col3s = this.props.sectionConfig.filter(section => section.col === '3');
    const allCols = [col1s, col2s, col3s];

    return [
      <Header
        key="head"
        spikeName={spikeName}
        spikeShortName={spikeShortName}
        spikeTitle={spikeTitle}
        spikeHeaderBG={spikeHeaderBG}
        spikeUrl={spikeUrl}
      />,
      <main key="main" className="col-group">
        {allCols.map((col, index) => (
          <div key={index} className="col">
            {col.map(sectionConfig => (
              <Section
                key={sectionConfig.name}
                sectionName={sectionConfig.name}
                sectionColor={sectionConfig.color}
                sectionTitle={sectionConfig.title}
                sectionRow={sectionConfig.row}
                sectionUrl={sectionConfig.url}
                sectionHtmlUrl={`${spikeUrl}cache_renders/rendered_${sectionConfig.name}.php`}
                spikeShortName={spikeShortName}
                autoRefresh={this.state.autoRefresh}
                moreOrLessChecked={this.state.moreOrLessChecked[sectionConfig.url]}
                setMoreOrLessChecked={this.setMoreOrLessChecked}
              />
            ))}
          </div>
        ))}
      </main>,
      <Footer key="footer" spikeName={spikeName} autoRefresh={this.state.autoRefresh} setAutoRefresh={this.setAutoRefresh} />
    ];
  }
}