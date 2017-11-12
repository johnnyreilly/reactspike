import * as React from 'react';
import { Section } from './section';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';
import { canUseDOM } from '../../canUseDOM';
import { ISpike } from '../../../src-feed-reader/interfaces';

interface IState {
  autoRefresh: boolean;
  moreOrLessChecked: { [sectionUrl: string]: boolean };
  intervalHandle?: number;
}

const AUTOREFRESH = 'autoRefresh';

export class SpikePage extends React.Component<ISpike, IState> {
  constructor(props: ISpike) {
    super(props);
    this.state = {
      autoRefresh: canUseDOM ? window.localStorage.getItem(AUTOREFRESH) === 'true' : false,
      moreOrLessChecked: canUseDOM
        ? JSON.parse(window.localStorage.getItem(`${this.props.spikeUrl}_moreOrLessChecked`) || '{}')
        : {}
    };
  }

  componentDidMount() {
    this.loadData();

    // refresh once a minute
    if (this.state.autoRefresh && canUseDOM) {
      const intervalHandle = this.scheduleAutoRefresh();
      this.setState(_prevState => ({ intervalHandle }));
    }
  }

  scheduleAutoRefresh = () => window.setInterval(() => this.loadData(), 60000);

  loadData() {
    if (!canUseDOM) {
      return;
    }

    const { sectionHtmlUrl } = this.props;
    this.setState(_prevState => ({ loading: true }));
    fetch(sectionHtmlUrl)
      .then(value => {
        if (value.ok) {
          value.text()
            .then(html => {
              this.setState(_prevState => ({ html, loading: false }));
              // window.localStorage.setItem(sectionHtmlUrl, html);
            })
            .catch(error => {
              this.setState(_prevState => ({ error: error.message ? error.message : error, loading: false }));
            });
        } else {
          this.setState(_prevState => ({ error: value.statusText, loading: false }));
        }
      })
      .catch(error => {
        this.setState(_prevState => ({ error: error.message ? error.message : error, loading: false }));
      });
  }

  setAutoRefresh = (autoRefresh: boolean) => {
    if (!canUseDOM) { return; }

    window.localStorage.setItem(AUTOREFRESH, autoRefresh ? 'true' : 'false');
    if (autoRefresh) {
      const intervalHandle = this.scheduleAutoRefresh();
      this.setState(_prevState => ({ autoRefresh, intervalHandle }));
    } else {
      window.clearInterval(this.state.intervalHandle);
      this.setState(_prevState => ({ autoRefresh, intervalHandle: undefined }));
    }
  }

  setMoreOrLessChecked = (sectionUrl: string, moreOrLessChecked: boolean) => {
    const allMoreOrLessChecked = Object.assign({ [sectionUrl]: moreOrLessChecked }, this.state.moreOrLessChecked);
    window.localStorage.setItem(`${this.props.spikeUrl}_moreOrLessChecked`, JSON.stringify(allMoreOrLessChecked));
    this.setState(_prevState => ({ moreOrLessChecked: allMoreOrLessChecked }));
  }

  render() {
    const { spikeName, spikeShortName, spikeUrl, spikeHeaderBG, spikeTitle } = this.props;
    const col1s = this.props.sections.filter(section => section.col === '1');
    const col2s = this.props.sections.filter(section => section.col === '2');
    const col3s = this.props.sections.filter(section => section.col === '3');
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