// tslint:disable:no-console
import { readFile } from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as React from 'react';
import * as express from 'express';
import { StaticRouter } from 'react-router-dom';
import { renderToNodeStream } from 'react-dom/server';
import { App } from './app';

const readFileAsync = promisify(readFile);
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
console.info(`Server starting in ${isDev ? 'dev mode' : 'prod mode'} on port ${PORT} ...`);

const server = express();

server.use(express.static('dist'));

server.get('/', async (req, res) => {
    if (isDev) {
        const { httpVersion, method, url } = req;
        console.info(`${httpVersion} ${method} ${url}`);
    }

    const indexHtml = await readFileAsync(path.join('dist', 'template.html'), 'utf8');
    const [indexHtmlStart, indexHtmlEnd] = indexHtml.split('Welcome to ReadSpike. Loading...');
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
});

server.listen(PORT, isDev
    ? () => console.info(`Serving up at http://localhost:${PORT} ...`)
    : undefined
);
