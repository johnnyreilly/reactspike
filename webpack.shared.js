const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rules = [
    {
        test: /.tsx?$/,
        use: [
            { loader: 'ts-loader', options: { happyPackMode: true } }
        ],
        exclude: path.resolve(process.cwd(), 'node_modules'),
        include: path.resolve(process.cwd(), 'src'),
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
        test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader?name=[name].[hash].[ext]'
    }
];

exports.browserEntry = {
    browser: [
        'core-js',
        'whatwg-fetch',
        './src/browser.tsx'
    ],
};

exports.serverEntry = {
    server: "./src/server.tsx"
};

exports.extensions = ['.ts', '.tsx', '.js', '.jsx'];

exports.rules = rules;

const DIST_DIR = 'dist';

exports.DIST_DIR = DIST_DIR;

exports.output = {
    path: path.resolve(__dirname, DIST_DIR),
    filename: '[name].js',
};
