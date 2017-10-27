import * as React from 'react';

interface ISectionProps {
    itemColor: string;
    itemUrl: string;
    itemHtmlUrl: string;
    itemName: string;
    itemTitle: string;
    itemRow: string;
    spikeShortName: string;
    autoRefresh: boolean;
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
            html: window.localStorage.getItem(props.itemHtmlUrl),
            error: undefined as string,
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();

        // refresh once a minute
        if (this.props.autoRefresh) {
            const intervalHandle = window.setInterval(() => this.loadData(), 60000);
            this.setState(_prevState => ({ intervalHandle }));
        }
    }

    componentWillReceiveProps(nextProps: ISectionProps) {
        if (nextProps.autoRefresh && !this.props.autoRefresh) {
            window.clearInterval(this.state.intervalHandle);
            this.setState(_prevState => ({ intervalHandle: undefined }));
        }
    }

    loadData() {
        const { itemHtmlUrl } = this.props;
        this.setState(_prevState => ({ loading: true }));
        fetch(itemHtmlUrl)
            .then(value => {
                if (value.ok) {
                    value.text()
                        .then(html => {
                            this.setState(_prevState => ({ html, loading: false }));
                            window.localStorage.setItem(itemHtmlUrl, html);
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

    render() {
        const { itemColor, itemUrl, itemName, itemTitle, itemRow, spikeShortName } = this.props;

        const itemNameLower = itemName.toLocaleLowerCase();
        const id = `toggler-${spikeShortName}-${itemNameLower}`;
        return (
            <section className={`link-section ${itemNameLower}-section`} data-order={itemRow}>
                <h2 className="col-header"><a href={itemUrl}>
                    <svg className="logo-readspike" style={{ fill: itemColor }}><use xlinkHref="#logo_readspike" /></svg>
                    {itemTitle}
                </a></h2>
                <input type="checkbox" className="toggle-list" id={id} />
                <label htmlFor={id} className="toggler-header fadeInTogglers" style={{ opacity: 0 }}>Show/hide</label>
                {
                    this.state.html
                        ? (
                            <ol
                                className={`links-list links-list--${itemNameLower}`}
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