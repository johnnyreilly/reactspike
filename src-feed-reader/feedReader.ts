// tslint:disable:no-console
import 'isomorphic-fetch';
import * as xml2js from 'xml2js';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

// TODO: Share this between job and app
interface ISpike {
    spikeName: string;
    spikeShortName: string;
    spikeUrl: string;
    spikeTitle: string;
    spikeDescription: string;
    spikeHeaderBG: string;
    spikeBodyBG: string;

    sectionConfig: ISectionConfig[];
}

interface ISectionConfig {
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

interface ISectionParsed<TResult = any> {
    result?: TResult;
    error?: any;
}

interface IReddit {
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

interface ISlashdot {
    'rdf:RDF': {
        item: IItem[];
    };
}

interface IRss {
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

interface IAtomRss {
    feed: {
        entry: {
            content: {
                _: string;
            }[];
            summary: {
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

interface ISectionData {
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

interface ISectionDataBitcoin {
    symbol: string;
    amount: string;
    code: string;
    country: string;
}

interface IPinboard {
    u: string;
    d: string;
    n: string;
    dt: string;
    a: string;
    t: string[];
}

interface IBitcoin {
    bpi: {
        [currencyCode: string]: {
            code: string;
            symbol: string;
            rate: string;
            description: string;
        }
    };
}

const readFileAsync = util.promisify(fs.readFile);
const readdirAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);

const spikeConfigsPath = path.join(__dirname, 'spike-configs');
const spikeDataPath = path.join(__dirname, 'spike-data');

async function fetchFeed(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return { text: undefined as string, error: `${response.status}: ${response.statusText}` };
        }

        const text = await response.text();
        return { text, error: undefined };
    } catch (error) {
        return { text: undefined as string, error };
    }
}

async function saveData(filename: string, data: string) {
    const filepath = path.join(spikeDataPath, filename);
    try {
        await writeFileAsync(filepath, data);
        console.info('JSON saved to ' + filepath);
    } catch (err) {
        console.error('Failed to save to ' + filepath, err);
    }
}

async function generateSpikeData(spikeConfigJsonFilename: string, spike: ISpike) {
    const configAndDatas = await Promise.all(spike.sectionConfig.map(async config => {
        const result = await fetchFeed(config.feed);
        if (result.text && config.type === 'xml') {
            try {
                const jsObj = await new Promise((resolve, reject) => {
                    xml2js.parseString(result.text, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
                return Object.assign({}, config, { result: jsObj } as ISectionParsed);
            } catch (err) {
                console.error('Failed to convert xml to json for ' + config.feed, err);

                // const invalidXmlFilepath = path.join(spikeDataPath, `${spike.spikeShortName || 'home'}-invalid-${config.title}.xml`);
                // await writeFileAsync(invalidXmlFilepath, result.text);
                // const reasonFilepath = path.join(spikeDataPath, `${spike.spikeShortName || 'home'}-invalid-${config.title}-reason.txt`);
                // await writeFileAsync(reasonFilepath, 'Failed to convert xml to json for ' + config.feed + '\r\n' + JSON.stringify(err));

                return Object.assign({}, config, { error: 'Failed to convert xml to json for ' + config.feed } as ISectionParsed);
            }
        }
        return Object.assign({}, config, (
            result.text
                ? { result: JSON.parse(result.text) }
                : result
        ) as ISectionParsed
        );
    }));

    const transformedData = configAndDatas.map(configAndData => {
        if (configAndData.error) {
            return configAndData;
        }

        const mapper = mappers[configAndData.name] || mappers[DEFAULT_MAPPER];
        return Object.assign({}, configAndData, { data: mapper(configAndData)/*, result: undefined*/ });
    });

    await saveData(spikeConfigJsonFilename, JSON.stringify({
        generatedAt: new Date().toISOString(),
        transformedData
    }));
}

const DEFAULT_MAPPER = '__defaultMapper';
const mappers: { [sectionName: string]: (configAndData: ISectionConfig & ISectionParsed) => any } = {
    'Reddit': (configAndData: ISectionConfig & ISectionParsed<IReddit>) => {
        const mappedData = configAndData.result.data.children.map<ISectionData>(child => ({
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
        return mappedData;
    },

    'Pinboard': (configAndData: ISectionConfig & ISectionParsed<IPinboard[]>) => {
        const mappedData = configAndData.result.map<ISectionData>(itm => ({
            selftext: itm.n ? itm.n : itm.d,
            title: itm.d ? itm.d : itm.n,
            url: itm.u
        }));
        return mappedData;
    },

    'Slashdot': (configAndData: ISectionConfig & ISectionParsed<ISlashdot>) => {
        const mappedData = configAndData.result['rdf:RDF'].item.map<ISectionData>(itm => ({
            selftext: itm.description ? itm.description[0] : undefined,
            title: itm.title ? itm.title[0] : undefined,
            url: itm.link ? itm.link[0] : undefined
        }));
        return mappedData;
    },

    'TheRegister': (configAndData: ISectionConfig & ISectionParsed<IAtomRss>) => {
        const mappedData = configAndData.result.feed.entry.map<ISectionData>(entry => ({
            selftext: entry.summary && entry.summary.length > 0 ? entry.summary[0]._ : undefined,
            title: entry.title && entry.title.length > 0 ? entry.title[0] : undefined,
            url: entry.link && entry.link.length > 0 ? entry.link[0].$.href : undefined,
        }));
        return mappedData;
    },

    'TheVerge': (configAndData: ISectionConfig & ISectionParsed<IAtomRss>) => {
        const mappedData = configAndData.result.feed.entry.map<ISectionData>(entry => ({
            selftext: entry.content && entry.content.length > 0 ? entry.content[0]._ : undefined,
            title: entry.title && entry.title.length > 0 ? entry.title[0] : undefined,
            url: entry.link && entry.link.length > 0 ? entry.link[0].$.href : undefined,
        }));
        return mappedData;
    },

    'Bitcoin': (configAndData: ISectionConfig & ISectionParsed<IBitcoin>) => {
        const mappedData = Object.keys(configAndData.result.bpi).map<ISectionDataBitcoin>(currencyCode => {
            const currency = configAndData.result.bpi[currencyCode];
            return {
                symbol: currency.symbol,
                amount: currency.rate,
                code: currency.code,
                country: currency.symbol
            };
        });
        return mappedData;
    },

    'HackerNews': (configAndData: ISectionConfig & ISectionParsed<IRss>) => {
        const mappedData = configAndData.result.rss.channel.map(chan =>
            chan.item.map<ISectionData>(itm => ({
                selftext: itm.description ? itm.description[0] : undefined,
                title: itm.title ? itm.title[0] : undefined,
                url: itm.link ? itm.link[0] : undefined,
                comments: itm.comments ? itm.comments[0] : undefined
            }))
        );
        const flat: ISectionData[] = [].concat.apply([], mappedData);
        return flat;
    },

    [DEFAULT_MAPPER]: (configAndData: ISectionConfig & ISectionParsed<IRss>) => {
        const mappedData = configAndData.result.rss.channel.map(chan =>
            chan.item.map<ISectionData>(itm => ({
                selftext: itm.description ? itm.description[0] : undefined,
                title: itm.title ? itm.title[0] : undefined,
                url: itm.link ? itm.link[0] : undefined
            }))
        );
        const flat: ISectionData[] = [].concat.apply([], mappedData);
        return flat;
    }
};

async function main() {
    try {
        const spikeConfigJsonFilenames = await readdirAsync(spikeConfigsPath);
        await spikeConfigJsonFilenames.forEach(async spikeConfigJsonFilename => {
            const spikeJson = await readFileAsync(path.join(spikeConfigsPath, spikeConfigJsonFilename), 'utf8');
            const spike: ISpike = JSON.parse(spikeJson);
            await generateSpikeData(spikeConfigJsonFilename, spike);
        });
    } catch (error) {
        console.error('Failed to load paths from: ' + spikeConfigsPath, error);
    }
    // theObj.sectionConfig.map(sectionConfig => sectionConfig.feed);

    // const outputFilename = path.join(__dirname, 'feedOutput.json');
    // const data = { testing: 123, at: new Date().toISOString() };
    // fs.writeFile(outputFilename, JSON.stringify(Object.assign({}, data, JSON.parse(theJson))), (err) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.log('JSON saved to ' + outputFilename);
    //     }
    // });
}

main();
