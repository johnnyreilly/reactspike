const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const DIST_DIR = 'dist';
module.exports = {
    context: process.cwd(), // to automatically find tsconfig.json
    entry: {
        main: [
            'core-js',
            'whatwg-fetch',
            './src/index.tsx'
        ]
    },
    output: {
        path: path.join(process.cwd(), DIST_DIR),
        filename: '[name].js',
    },
    plugins: [
        new FaviconsWebpackPlugin('./src/apple-touch-icon.png'),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            memoryLimit: 4096,
            checkSyntacticErrors: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new UglifyJSPlugin({
            unused: true,
            dead_code: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.PUBLIC_URL': JSON.stringify('' /*'https://johnnyreilly.github.io/reactspike/'*/),
            'process.env.API_BASE_URL': JSON.stringify(''),
            'process.env.APP_BASE_URL': JSON.stringify(''),
            'process.env.LOGIN_APP_BASE_URL': JSON.stringify(''),
            'process.env.LOGIN_API_BASE_URL': JSON.stringify(''),
        }),
        new HtmlWebpackPlugin({
            // hash: true,
            inject: true,
            template: 'src/index.html',
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
        new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
        new WorkboxPlugin({
            globDirectory: DIST_DIR,
            globPatterns: ['**/*.{html,js,css}'],
            swDest: path.join(DIST_DIR, 'sw.js'),
        }),
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    { loader: 'cache-loader' },
                    {
                        loader: 'thread-loader',
                        options: {
                            // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                            workers: require('os').cpus().length - 1,
                        },
                    },
                    { loader: 'ts-loader', options: { happyPackMode: true } }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            camelCase: true,
                            importLoaders: 2,
                            minimize: true
                        }
                    },
                    { loader: 'resolve-url-loader' },
                    { loader: "sass-loader?sourceMap" }
                    ]
                })
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {
                        noquotes: false
                    }
                }
            },
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$/,
                loader: 'file-loader?name=[name].[hash].[ext]'
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};
