// tslint:disable:no-console
import { readFile } from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as React from 'react';
import * as express from 'express';
import * as compression from 'compression';
import { StaticRouter } from 'react-router-dom';
import { renderToNodeStream } from 'react-dom/server';
import { App } from './app';
import { setBootSpikeData } from './bootData';
import { ISpike } from '../src-feed-reader/interfaces';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

console.info(`Server starting in ${isDev ? 'dev mode' : 'prod mode'} on port ${PORT} in ${process.cwd()} __dirname: ${__dirname} ...`);

const spikeDataJsonPath = path.resolve(__dirname, '..', 'App_Data', 'jobs', 'triggered', 'create-json', 'dist-feed-reader', 'spike-data');
const readFileAsync = util.promisify(readFile);

async function getSpikeData(spikeName: string) {
    const jsonRequired = path.join(spikeDataJsonPath, (spikeName || 'home') + '.json');
    const json = await readFileAsync(jsonRequired, 'utf8');
    const spike: ISpike = JSON.parse(json);
    return spike;
}

function spaFallback(callback: express.RequestHandler) {
    const requestHandler: express.RequestHandler = (req, res, next) => {
        if (req.method === 'GET' && req.accepts('html')) {
            callback(req, res, next);
        } else next();
    };
    return requestHandler;
}

async function startServer({ templatePath }: { templatePath: string }) {
    try {
        const indexHtml = await readFileAsync(templatePath, 'utf8');

        const [indexHtmlStart, indexHtmlEnd] = indexHtml.split('Welcome to ReadSpike. Loading...');
        const server = express();

        server.use(compression());

        server.use(express.static(__dirname));
        server.use(express.static(spikeDataJsonPath));

        server.use(spaFallback(async (req, res, _next) => {
            if (isDev) {
                const { httpVersion, method, url } = req;
                console.info(`${httpVersion} ${method} ${url}`);
            }

            res.set('Content-Type', 'text/html');
            res.setHeader('Surrogate-Control', 'no-store');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.write(indexHtmlStart);

            try {
                const spike = await getSpikeData(req.url.substr(1));
                setBootSpikeData(spike);
            } catch (error) {
                console.error('Failed to load json for ' + req.url);
            }

            const context = {};
            const stream = renderToNodeStream(
                <StaticRouter location={req.url} context={context}>
                    <App />
                </StaticRouter>
            );
            stream.pipe(res, { end: false });

            stream.on('end', () => {
                /*
                const jsonPath = path.join(spikeDataJsonPath, `${req.url === '/' ? 'home' : req.url.substr(1)}.json`);
                
                let json: string;
                try {
                    json = await readFileAsync(jsonPath, 'utf8');
                } catch (error) {
                    // TODO: do something with error
                }

                res.write(json === undefined 
                    ? indexHtmlEnd
                    : indexHtmlEnd.replace('</div>', `</div><script>window.bootData = ${json};</script>`));
                    */
                res.write(indexHtmlEnd);
                res.end();
            });
        }));

        server.listen(PORT, isDev
            ? () => console.info(`Serving up at http://localhost:${PORT} ...`)
            : undefined
        );

    } catch (err) {
        console.error('Problem loading ' + templatePath, err);
    }

}

startServer({ templatePath: path.join(__dirname, 'template.html') });
