import * as React from 'react';

interface ISectionProps {
    itemColor: string;
    itemURL: string;
    itemName: string;
    itemTitle: string;
    itemRow: string;
    spikeShortName: string;
}

interface IState {
    html: string;
    loading: boolean;
}

export class Section extends React.Component<ISectionProps, IState> {
    state = {
        html: undefined as string,
        loading: false
    };

    componentDidMount() {
        this.setState(_prevState => ({ loading: true }));
        fetch(this.props.itemURL)
            .then(value => {
                if (value.ok) {
                    value.text()
                        .then(html => this.setState(_prevState => ({ html, loading: false })))
                        .catch(error => this.setState(_prevState => ({ html: `error... ${JSON.stringify(error)}`, loading: false })));
                } else {
                    this.setState(_prevState => ({ html: `error... ${value.statusText}`, loading: false }));
                }
            })
            .catch(error => this.setState(_prevState => ({ html: `error... ${JSON.stringify(error)}`, loading: false })));
    }

    render() {
        const { itemColor, itemURL, itemName, itemTitle, itemRow, spikeShortName } = this.props;

        const itemNameLower = itemName.toLocaleLowerCase();
        const id = `toggler-${spikeShortName}-${itemNameLower}`;
        return (
            <section className={`link-section ${itemNameLower}-section`} data-order={itemRow}>
                <h2 className="col-header"><a href={itemURL}>
                    <svg className="logo-readspike" style={{ fill: itemColor }}><use xlinkHref="#logo_readspike" /></svg>
                    {itemTitle}
                </a></h2>
                <input type="checkbox" className="toggle-list" id={id} />
                <label htmlFor={id} className="toggler-header" style={{ opacity: 0 }}>Show/hide</label>
                { 
                    this.state.html 
                        ? (
                            <ol
                                className={`links-list links-list--${itemNameLower}`}
                                dangerouslySetInnerHTML={{ __html: this.state.html }}
                            />
                        )
                        : this.state.loading ? <strong>LOADING</strong> : <strong>...</strong>
                }
                
                <label htmlFor={id} className="toggler-footer" style={{ opacity: 0 }}>Show/hide
            <svg className="icon"><use xlinkHref="#icon_arrow" /></svg>
                </label>
            </section>
        );
    }
}