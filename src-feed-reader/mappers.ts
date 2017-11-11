import {
    ISectionConfig,
    ISectionParsed,
    IReddit,
    ISlashdot,
    IRss,
    IAtomRss,
    IBitcoin,
    IPinboard,
    ISectionData,
    ISectionDataBitcoin,
    ISectionMapped
} from './interfaces';

type Mapper<TData = any> = (configAndData: ISectionConfig & ISectionParsed<TData>) => ISectionMapped;

const redditMapper: Mapper<IReddit> = configAndData => {
    const data = configAndData.result.data.children.map<ISectionData>(child => ({
        numComments: child.data.num_comments,
        over18: child.data.over_18,
        comments: `https://reddit.com${child.data.permalink}`,
        postHint: child.data.post_hint === 'rich:video' ? 'video' : child.data.post_hint,
        thumbnail: child.data.preview && child.data.preview.images.length > 0 && child.data.preview.images[0].resolutions.length > 0
            ? child.data.preview.images[0].resolutions[child.data.preview.images[0].resolutions.length - 1].url
            : undefined,
        selftext: child.data.selftext,
        subreddit: child.data.subreddit,
        stickied: child.data.stickied,
        title: child.data.title,
        url: child.data.url,
        ups: child.data.ups,
    }));
    return { data };
};

const pinboardMapper: Mapper<IPinboard[]> = configAndData => {
    const data = configAndData.result.map<ISectionData>(itm => ({
        selftext: itm.n ? itm.n : itm.d,
        title: itm.d ? itm.d : itm.n,
        url: itm.u
    }));
    return { data };
};

const slashdotMapper: Mapper<ISlashdot> = configAndData => {
    const data = configAndData.result['rdf:RDF'].item.map<ISectionData>(itm => ({
        selftext: itm.description ? itm.description[0] : undefined,
        title: itm.title ? itm.title[0] : undefined,
        url: itm.link ? itm.link[0] : undefined
    }));
    return { data };
};

const theRegisterMapper: Mapper<IAtomRss> = configAndData => {
    const data = configAndData.result.feed.entry.map<ISectionData>(entry => ({
        selftext: entry.summary && entry.summary.length > 0 ? entry.summary[0]._ : undefined,
        title: entry.title && entry.title.length > 0 ? entry.title[0] : undefined,
        url: entry.link && entry.link.length > 0 ? entry.link[0].$.href : undefined,
    }));
    return { data };
};

const theVergeMapper: Mapper<IAtomRss> = configAndData => {
    const data = configAndData.result.feed.entry.map<ISectionData>(entry => ({
        selftext: entry.content && entry.content.length > 0 ? entry.content[0]._ : undefined,
        title: entry.title && entry.title.length > 0 ? entry.title[0] : undefined,
        url: entry.link && entry.link.length > 0 ? entry.link[0].$.href : undefined,
    }));
    return { data };
};

const bitcoinMapper: Mapper<IBitcoin> = configAndData => {
    const dataBitcoin = Object.keys(configAndData.result.bpi).map<ISectionDataBitcoin>(currencyCode => {
        const currency = configAndData.result.bpi[currencyCode];
        return {
            symbol: currency.symbol,
            amount: currency.rate,
            code: currency.code,
            country: currency.symbol
        };
    });
    return { dataBitcoin };
};

const hackerNewsMapper: Mapper<IRss> = configAndData => {
    const mappedData = configAndData.result.rss.channel.map(chan =>
        chan.item.map<ISectionData>(itm => ({
            selftext: itm.description ? itm.description[0] : undefined,
            title: itm.title ? itm.title[0] : undefined,
            url: itm.link ? itm.link[0] : undefined,
            comments: itm.comments ? itm.comments[0] : undefined
        }))
    );
    const data: ISectionData[] = [].concat.apply([], mappedData);
    return { data };
};

const defaultMapper: Mapper<IRss> = configAndData => {
    const mappedData = configAndData.result.rss.channel.map(chan =>
        chan.item.map<ISectionData>(itm => ({
            selftext: itm.description ? itm.description[0] : undefined,
            title: itm.title ? itm.title[0] : undefined,
            url: itm.link ? itm.link[0] : undefined
        }))
    );
    const data: ISectionData[] = [].concat.apply([], mappedData);
    return { data };
};

const DEFAULT_MAPPER = '__defaultMapper';
const mappers: { [sectionName: string]: Mapper } = {
    'Reddit': redditMapper,
    'Pinboard': pinboardMapper,
    'Slashdot': slashdotMapper,
    'TheRegister': theRegisterMapper,
    'TheVerge': theVergeMapper,
    'Bitcoin': bitcoinMapper,
    'HackerNews': hackerNewsMapper,

    [DEFAULT_MAPPER]: defaultMapper
};

export function mapData(configAndData: ISectionConfig & ISectionParsed) {
    const mapper = mappers[configAndData.name] || mappers[DEFAULT_MAPPER];
    return mapper(configAndData);
}