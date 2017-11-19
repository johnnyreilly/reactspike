const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { rules, extensions, browserEntryDev, serverEntry, output } = require('./webpack.shared');

const PUBLIC_URL = 'http://localhost:3000';
// const PUBLIC_URL = 'https://reactspike.azurewebsites.net';
const definedVariables = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
});

const browserConfig = {
    entry: browserEntryDev,

    output,

    resolve: { extensions },

    devtool: 'inline-source-map',
    stats: 'minimal',

    module: { rules },

    plugins: [
        definedVariables,

        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),

        // These plugins will create the HTML / CSS / FavIcon etc static assets 
        new CopyWebpackPlugin([{
            from: 'src/images',
            to: 'images'
        }]),
        new HtmlWebpackPlugin({
            favicon: 'src/favicon.ico',
            filename: 'template.html',
            inject: true,
            template: 'src/template.html'
        }),
        new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
        new StyleExtHtmlWebpackPlugin(),
        
        // Since the type checker covers both client and server code we only need a single instance 
        // of the plugin; not one for both client and server
        new ForkTsCheckerNotifierWebpackPlugin({ title: 'TypeScript', excludeWarnings: false }),
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
            checkSyntacticErrors: true,
            watch: ['./src'] // optional but improves performance (fewer stat calls)
        }),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
};

const serverConfig = {
    entry: serverEntry,

    output,

    resolve: { extensions },

    devtool: 'inline-source-map',
    stats: 'normal',

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
