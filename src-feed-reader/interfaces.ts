// TODO: Share this between job and app
export interface ISpikeConfig extends ISpikeCommon {
    sectionConfig: ISectionConfig[];
}

export interface ISpike extends ISpikeCommon {
    generatedAt: string;
    sections: Section[];
}

interface ISpikeCommon {
    spikeName: string;
    spikeShortName: string;
    spikeUrl: string;
    spikeTitle: string;
    spikeDescription: string;
    spikeHeaderBG: string;
    spikeBodyBG: string;
}

export type Section = ISectionConfig & ISectionParsed & ISectionMapped;

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

export interface ISectionParsed<TResult = any> {
    result?: TResult;
    error?: any;
}

// RSS's

export interface IReddit {
    data: {
        children: {
            data: {
                num_comments: number;
                over_18: boolean;
                permalink: string;
                post_hint: 'rich:video' | 'image' | 'text';
                preview: {
                    images: {
                        resolutions: {
                            url: string;
                        }[];
                    }[];
                };
                selftext: string;
                subreddit: string;
                stickied: boolean;
                title: string;
                url: string;
                ups: number;
            }
        }[];
    };
}

export interface ISlashdot {
    'rdf:RDF': {
        item: IItem[];
    };
}

export interface IRss {
    rss: {
        channel: {
            item: IItem[];
        }[];
    };
}

interface IItem {
    description: string[];
    title: string[];
    link: string[];
    comments?: string[];
}

export interface ITheVerge {
    feed: {
        entry: {
            content: {
                _: string;
            }[];
            title: string[];
            link: {
                $: {
                    href: string;
                }
            }[];
        }[];
    };
}

export interface ITheRegister {
    feed: {
        entry: {
            summary: {
                _: string;
            }[];
            title: {
                _: string;
            }[];
            link: {
                $: {
                    href: string;
                }
            }[];
        }[];
    };
}

export interface IPinboard {
    u: string;
    d: string;
    n: string;
    dt: string;
    a: string;
    t: string[];
}

export interface IBitcoin {
    bpi: {
        [currencyCode: string]: {
            code: string;
            symbol: string;
            rate: string;
            description: string;
        }
    };
}

// Output

export interface ISectionData {
    title: string;
    selftext: string;
    url: string;
    comments?: string;
    numComments?: number;
    name?: string;
    over18?: boolean;
    postHint?: string;
    stickied?: boolean;
    thumbnail?: string;
    subreddit?: string;
    ups?: number;
}

export interface ISectionDataBitcoin {
    symbol: string;
    amount: string;
    code: string;
}

export interface ISectionMapped { 
    data?: ISectionData[]; 
    dataBitcoin?: ISectionDataBitcoin[];
}