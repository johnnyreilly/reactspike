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

interface IRss {
    rss: {
        channel: {
            item: {
                description: string[];
                title: string[];
                link: string[];
                comments: string[];
            }[];
        }[];
    };
}

interface ISectionData {
    title: string;
    selftext: string;
    url: string;
    comments?: string;
    name?: string;
    over18?: boolean;
    postHint?: string;
    stickied?: boolean;
    thumbnail?: string;
    subreddit?: string;
    ups?: string;
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
    'Reddit': (_configAndData) => { return {}; },

    'Pinboard': (_configAndData) => { return {}; },

    'Slashdot': (_configAndData) => { return {}; },

    'TheRegister': (_configAndData) => { return {}; },

    'TheVerge': (_configAndData) => { return {}; },

    'Bitcoin': (_configAndData) => { return {}; },

    'HackerNews': (configAndData: ISectionConfig & ISectionParsed<IRss>) => {
        const mappedData = configAndData.result.rss.channel.map(chan => {
            return chan.item.map<ISectionData>(itm => ({
                selftext: itm.description ? itm.description[0] : undefined,
                title: itm.title ? itm.title[0] : undefined,
                url: itm.link ? itm.link[0] : undefined,
                comments: itm.comments ? itm.comments[0] : undefined
            }));
        });
        const flat: ISectionData[] = [].concat.apply([], mappedData);
        return flat;
    },

    [DEFAULT_MAPPER]: (configAndData: ISectionConfig & ISectionParsed<IRss>) => {
        const mappedData = configAndData.result.rss.channel.map(chan => {
            return chan.item.map<ISectionData>(itm => ({
                selftext: itm.description ? itm.description[0] : undefined,
                title: itm.title ? itm.title[0] : undefined,
                url: itm.link ? itm.link[0] : undefined
            }));
        });
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
