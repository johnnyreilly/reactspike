import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Section } from './section';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';
import { canUseDOM } from '../../canUseDOM';
import { ISpike } from '../../../src-feed-reader/interfaces';
import { getBootData } from '../../bootData';
import { ItemTemplate } from './itemTemplate';
import { ItemTemplateBitcoin } from './itemTemplateBitcoin';

interface ISpikeProps extends RouteComponentProps<{}> {
}

interface IState {
  autoRefresh: boolean;
  moreOrLessChecked: { [sectionUrl: string]: boolean };
  spikeData: ISpike;
  intervalHandle?: number;
}

const AUTOREFRESH = 'autoRefresh';

export class SpikePage extends React.Component<ISpikeProps, IState> {
  constructor(props: ISpikeProps) {
    super(props);
    this.state = canUseDOM
      ? {
        autoRefresh: window.localStorage.getItem(AUTOREFRESH) === 'true',
        moreOrLessChecked: JSON.parse(window.localStorage.getItem(`${props.match.url}_moreOrLessChecked`) || '{}'),
        spikeData: getBootData(props.match.url)
      }
      : {
        autoRefresh: false,
        moreOrLessChecked: {},
        spikeData: require(`../../../App_Data/jobs/triggered/create-json/dist-feed-reader/spike-data${
          props.match.url === '/' ? '/home' : props.match.url
          }.json`)
      };
  }

  componentDidMount() {
    if (!this.state.spikeData) {
      this.loadData();
    }

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

    // const { sectionHtmlUrl } = this.props;
    // this.setState(_prevState => ({ loading: true }));
    // fetch(sectionHtmlUrl)
    //   .then(value => {
    //     if (value.ok) {
    //       value.text()
    //         .then(html => {
    //           this.setState(_prevState => ({ html, loading: false }));
    //           // window.localStorage.setItem(sectionHtmlUrl, html);
    //         })
    //         .catch(error => {
    //           this.setState(_prevState => ({ error: error.message ? error.message : error, loading: false }));
    //         });
    //     } else {
    //       this.setState(_prevState => ({ error: value.statusText, loading: false }));
    //     }
    //   })
    //   .catch(error => {
    //     this.setState(_prevState => ({ error: error.message ? error.message : error, loading: false }));
    //   });
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
    window.localStorage.setItem(`${this.props.match.url}_moreOrLessChecked`, JSON.stringify(allMoreOrLessChecked));
    this.setState(_prevState => ({ moreOrLessChecked: allMoreOrLessChecked }));
  }

  render() {
    const { spikeName, spikeShortName, spikeUrl, spikeHeaderBG, spikeTitle, sections } = this.state.spikeData;
    const col1s = sections.filter(section => section.col === '1');
    const col2s = sections.filter(section => section.col === '2');
    const col3s = sections.filter(section => section.col === '3');
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
                spikeShortName={spikeShortName}
                autoRefresh={this.state.autoRefresh}
                moreOrLessChecked={this.state.moreOrLessChecked[sectionConfig.url]}
                setMoreOrLessChecked={this.setMoreOrLessChecked}
              >
                {
                  sectionConfig.name === 'Bitcoin'
                    ? sectionConfig.dataBitcoin.map(bitcoin =>
                      <ItemTemplateBitcoin key={bitcoin.code} {...bitcoin} />)
                    : sectionConfig.data.map(data =>
                      <ItemTemplate key={data.title} {...data} />)
                }
              </Section>
            ))}
          </div>
        ))}
      </main>,
      <Footer key="footer" spikeName={spikeName} autoRefresh={this.state.autoRefresh} setAutoRefresh={this.setAutoRefresh} />
    ];
  }
}