// tslint:disable:no-console
import 'isomorphic-fetch';
import * as xml2js from 'xml2js';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import {
    ISpikeConfig,
    ISectionParsed,
    Section,
    ISpike
} from './interfaces';
import { mapData } from './mappers';

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

async function generateSpikeData(spikeConfigJsonFilename: string, spike: ISpikeConfig) {
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

    const sections = configAndDatas.map<Section>(configAndData =>
        Object.assign(
            {},
            configAndData,
            // { result: undefined }, // Don't include the rss feed data
            configAndData.error
                ? undefined
                : mapData(configAndData))
    );

    const transformedSpike: ISpike = Object.assign({}, spike, {
        generatedAt: new Date().toISOString(),
        sectionConfig: undefined,
        sections
    });

    await saveData(spikeConfigJsonFilename, JSON.stringify(transformedSpike));
}

async function main() {
    try {
        const spikeConfigJsonFilenames = await readdirAsync(spikeConfigsPath);
        await spikeConfigJsonFilenames.forEach(async spikeConfigJsonFilename => {
            const spikeJson = await readFileAsync(path.join(spikeConfigsPath, spikeConfigJsonFilename), 'utf8');
            const spike: ISpikeConfig = JSON.parse(spikeJson);
            await generateSpikeData(spikeConfigJsonFilename, spike);
        });
    } catch (error) {
        console.error('Failed to load paths from: ' + spikeConfigsPath, error);
    }
}

main();
