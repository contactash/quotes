const { resolve } = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : process.env.NODE_ENV;
const PRODUCTION = ENVIRONMENT === 'production';
const DEVELOPMENT = ENVIRONMENT === 'development';
const entry =  PRODUCTION
    ?  ['./index.js']
    :  [
        'babel-polyfill',
        // polyfill to make application work in IE. this must be the first element in this array
        
        'react-hot-loader/patch',
        // activate HMR for React

        'webpack-dev-server/client?http://localhost:8080',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint

        'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates

        './index.js'
        // the entry point of our app
    ];

let plugins = PRODUCTION
    ?  [new UglifyJSPlugin({
        compress: true,
        sourceMap : false
    }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })]
    :  [    // enable HMR globally
        new webpack.HotModuleReplacementPlugin(),

        // prints more readable module names in the browser console on HMR updates];
        new webpack.NamedModulesPlugin(),
    ];

//Make push environment variables in source code
plugins.push(
    new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(PRODUCTION),
        DEVELOPMENT: JSON.stringify(DEVELOPMENT),
    }),

    new ExtractTextPlugin('style.css'));


module.exports = {
    entry: entry,
    output: {
        filename: 'bundle.js',
        // the output bundle

        path: resolve(__dirname, 'dist'),

        publicPath: '/'
        // necessary for HMR to know where to load the hot update chunks
    },

    context: resolve(__dirname, 'src'),

    devtool: 'inline-source-map',

    devServer: {
        hot: DEVELOPMENT,
        // enable HMR on the server

        contentBase: resolve(__dirname, 'dist'),
        // match the output path

        port: 5000,

        publicPath: '/'
        // match the output `publicPath`
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            },
            {
                test:[ /\.css$/,  /\.scss$/],
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                }),
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: [
                    'eslint-loader',
                ],
                exclude: /node_modules/
            }
        ],
    },


    plugins: plugins,
};


