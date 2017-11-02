// tslint:disable:no-console
import { readFile } from 'fs';
import * as path from 'path';
import * as React from 'react';
import * as express from 'express';
import { StaticRouter } from 'react-router-dom';
import { renderToNodeStream } from 'react-dom/server';
import { App } from './app';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
console.info(`Server starting in ${isDev ? 'dev mode' : 'prod mode'} on port ${PORT} in ${process.cwd()} __dirname: ${__dirname} ...`);

const templatePath = path.join(__dirname, 'template.html');
readFile(templatePath, 'utf8', (err, indexHtml) => {
    if (err) {
        console.error('Problem loading ' + templatePath, err);
        return;
    }

    const [indexHtmlStart, indexHtmlEnd] = indexHtml.split('Welcome to ReadSpike. Loading...');
    const server = express();

    server.use(express.static(__dirname));

    function spaFallback(callback: express.RequestHandler) {
        const requestHandler: express.RequestHandler = (req, res, next) => {
            if (req.method === 'GET' && req.accepts('html')) {
                callback(req, res, next);
            } else next();
        };
        return requestHandler;
    }

    server.use(spaFallback((req, res, _next) => {
        if (isDev) {
            const { httpVersion, method, url } = req;
            console.info(`${httpVersion} ${method} ${url}`);
        }

        res.write(indexHtmlStart);

        const context = {};
        const stream = renderToNodeStream(
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        );
        stream.pipe(res, { end: false });

        stream.on('end', () => {
            res.write(indexHtmlEnd);
            res.end();
        });
    }));

    server.listen(PORT, isDev
        ? () => console.info(`Serving up at http://localhost:${PORT} ...`)
        : undefined
    );
});