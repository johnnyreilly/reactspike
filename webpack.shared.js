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

function makeVendorEntry(config) {
    const packageJson = require('./package.json');
    const vendorDependencies = Object.keys(packageJson['dependencies']);

    // config example value: 
    // {
    //     mainModules: [ './src/index.tsx' ],
    //     modulesToExclude: ['express']
    // }
    const vendorModulesMinusExclusions = vendorDependencies.filter(vendorModule =>
        config.mainModules.indexOf(vendorModule) === -1 && config.modulesToExclude.indexOf(vendorModule) === -1);

    return vendorModulesMinusExclusions;
}

const browser = [ './src/browser.tsx' ];
const vendor = makeVendorEntry({ mainModules: browser, modulesToExclude: ['compression', 'express', 'xml2js'] })

exports.browserEntry = { vendor, browser };
exports.serverEntry = { server: './src/server.tsx' };

exports.extensions = ['.ts', '.tsx', '.js', '.jsx'];

exports.rules = rules;

const DIST_DIR = 'dist';

exports.DIST_DIR = DIST_DIR;

exports.output = {
    path: path.resolve(__dirname, DIST_DIR),
    filename: '[name].js',
};
