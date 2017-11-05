import * as React from 'react';
import { canUseDOM } from '../../canUseDOM';

interface ISectionProps {
    sectionUrl: string;
    sectionColor: string;
    sectionHtmlUrl: string;
    sectionName: string;
    sectionTitle: string;
    sectionRow: string;
    spikeShortName: string;
    autoRefresh: boolean;
    moreOrLessChecked: boolean;
    setMoreOrLessChecked: (sectionUrl: string, moreOrLessChecked: boolean) => void;
}

interface IState {
    html: string;
    error: string;
    loading: boolean;
    intervalHandle?: number;
}

export class Section extends React.Component<ISectionProps, IState> {
    constructor(props: ISectionProps) {
        super(props);
        this.state = {
            html: canUseDOM ? /*window.localStorage.getItem(props.sectionHtmlUrl)*/undefined : undefined,
            error: undefined as string,
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();

        // refresh once a minute
        if (this.props.autoRefresh && canUseDOM) {
            const intervalHandle = window.setInterval(() => this.loadData(), 60000);
            this.setState(_prevState => ({ intervalHandle }));
        }
    }

    componentWillReceiveProps(nextProps: ISectionProps) {
        if (nextProps.autoRefresh && !this.props.autoRefresh && window) {
            window.clearInterval(this.state.intervalHandle);
            this.setState(_prevState => ({ intervalHandle: undefined }));
        }
    }

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

    moreOrLess = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setMoreOrLessChecked(this.props.sectionHtmlUrl, event.target.checked);
    }

    render() {
        const { sectionColor, sectionUrl, sectionName, sectionTitle, sectionRow, spikeShortName, moreOrLessChecked } = this.props;

        const sectionNameLower = sectionName.toLocaleLowerCase();
        const id = `toggler-${spikeShortName}-${sectionNameLower}`;
        return (
            <section className={`link-section ${sectionNameLower}-section`} data-order={sectionRow}>
                <h2 className="col-header"><a href={sectionUrl}>
                    <svg className="logo-readspike" style={{ fill: sectionColor }}><use xlinkHref="#logo_readspike" /></svg>
                    {sectionTitle}
                </a></h2>
                <input type="checkbox" className="toggle-list" id={id} onChange={this.moreOrLess} checked={moreOrLessChecked} />
                <label htmlFor={id} className="toggler-header fadeInTogglers" style={{ opacity: 0 }}>Show/hide</label>
                {
                    this.state.html
                        ? (
                            <ol
                                className={`links-list links-list--${sectionNameLower}`}
                                dangerouslySetInnerHTML={{ __html: this.state.html }}
                            />
                        )
                        : this.state.loading ? <strong>LOADING</strong> : <strong>{this.state.error}</strong>
                }

                <label htmlFor={id} className="toggler-footer fadeInTogglers" style={{ opacity: 0 }}>Show/hide
                <svg className="icon"><use xlinkHref="#icon_arrow" /></svg>
                </label>
            </section>
        );
    }
}