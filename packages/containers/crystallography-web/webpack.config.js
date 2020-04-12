const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',

    devtool:  'source-map',

    entry: {
        'app': path.resolve(__dirname, './src/frontend/app.tsx')
    },

    output: {
        path: __dirname + '/dist/static/',
        publicPath: '/',
        filename: '[hash].js'
    },

    plugins: [
        new webpack.DefinePlugin({
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new ExtractTextPlugin("[hash].css"),
        new HtmlWebpackPlugin({
            template: __dirname + '/src/static/index.html',
            favicon: __dirname + '/src/static/favicon.ico'
        }),
        new CopyWebpackPlugin([{
            from: __dirname + '/src/static/favicon.ico'
        }, {
            from: __dirname + '/src/static/robots.txt'
        }, {
            from: __dirname + '/src/static/index.html'
        }]),
    ],

    module: {
          rules: [
            { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader','less-loader']
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
};
