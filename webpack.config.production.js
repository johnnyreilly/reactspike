const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { rules, extensions, browserEntry, serverEntry, output, DIST_DIR } = require('./webpack.shared');

// const PUBLIC_URL = 'http://localhost:3000';
const PUBLIC_URL = 'https://reactspike.azurewebsites.net';
const definedVariables = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
});

const browserConfig = {
    entry: browserEntry,

    output,

    resolve: { extensions },

    module: { rules },

    plugins: [
        definedVariables,

        // These plugins will create the HTML / CSS / FavIcon / ServiceWorker etc static assets 
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),
        new FaviconsWebpackPlugin('./src/apple-touch-icon.png'),
        new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
        new HtmlWebpackPlugin({
            // hash: true,
            filename: 'template.html',
            inject: true,
            template: 'src/template.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new UglifyJSPlugin(),
        new WorkboxPlugin({
            globDirectory: DIST_DIR,
            globPatterns: ['**/*.{js,css}', '**/*.{png,svg,jpg,gif,json}'],
            globIgnores: ['server.js'],
            swDest: path.resolve(DIST_DIR, 'sw.js'),
            clientsClaim: true,
            skipWaiting: true,
            // navigateFallback: 'template.html',
            runtimeCaching: [{
                // match content from readspike.com
                urlPattern: new RegExp('https://readspike.com'),
                handler: 'networkFirst',
                options: { cacheName: 'readspike-cache' }
            }, {
                // match empty strings and words under the website eg https://reactspike.azurewebsites.net/world
                // - intended to cache server side rendered code
                urlPattern: new RegExp(PUBLIC_URL + '\/(\\w*)\$'),
                handler: 'networkFirst',
                options: { cacheName: 'html-cache' }
            }]
        }),

        // Since the type checker covers both client and server code we only need a single instance 
        // of the plugin; not one for both client and server
        new ForkTsCheckerWebpackPlugin({
            async: false,
            memoryLimit: 4096,
            checkSyntacticErrors: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
};

const serverConfig = {
    entry: serverEntry,

    output,

    resolve: { extensions },

    module: { rules },

    plugins: [
        definedVariables
    ],

    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [nodeExternals()],
};

module.exports = [browserConfig, serverConfig];
