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

const definedVariables = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.PUBLIC_URL': JSON.stringify(''),
});

const browserConfig = {
    entry: browserEntry,

    output,

    resolve: { extensions },

    module: { rules },

    plugins: [
        definedVariables,

        // These plugins will create the HTML / CSS / FavIcon / ServiceWorker etc static assets 
        new FaviconsWebpackPlugin('./src/apple-touch-icon.png'),
        new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
        new HtmlWebpackPlugin({
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
        new UglifyJSPlugin({
            unused: true,
            dead_code: true
        }),
        new WorkboxPlugin({
            globDirectory: DIST_DIR,
            globPatterns: ['**/*.{html,js,css}'],
            globIgnores: ['server.js'],
            clientsClaim: true,
            skipWaiting: true,
            // navigateFallback: 'template.html',
            runtimeCaching: [{
                // match empty strings and words
                urlPattern: /^(^.{0}|\w+)$/,
                handler: 'networkFirst',
                options: {
                    networkTimeoutSeconds: 2,
                },
            }, {
                // match files with a suffix eg html / css / js etc
                urlPattern: /\.[\w\d]+$/,
                handler: 'cacheFirst',
            }],
            swDest: path.resolve(DIST_DIR, 'sw.js'),
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
