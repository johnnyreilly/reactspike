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

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
console.info(`Server starting in ${isDev ? 'dev mode' : 'prod mode'} on port ${PORT} in ${process.cwd()} __dirname: ${__dirname} ...`);

const readFileAsync = util.promisify(readFile);

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

        const spikeDataJsonPath = path.resolve(__dirname, '..', 'App_Data', 'jobs', 'triggered', 'create-json', 'dist-feed-reader', 'spike-data');
        server.use(express.static(__dirname));
        server.use(express.static(spikeDataJsonPath));

        server.use(spaFallback((req, res, _next) => {
            if (isDev) {
                const { httpVersion, method, url } = req;
                console.info(`${httpVersion} ${method} ${url}`);
            }

            res.set('Content-Type', 'text/html');
            res.write(indexHtmlStart);

            const context = {};
            const stream = renderToNodeStream(
                <StaticRouter location={req.url} context={context}>
                    <App />
                </StaticRouter>
            );
            stream.pipe(res, { end: false });

            stream.on('end', () => {
                /*
                const jsonPath = path.join(spikeDataJsonPath, `${req.url === '/' ? 'home' : req.url.substr(0)}.json`);
                
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
