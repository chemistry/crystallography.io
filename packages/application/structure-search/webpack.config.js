const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',

    devtool:  'source-map',

    entry: {
        'main': path.resolve(__dirname, './src/renderer/index.tsx')
    },

    output: {
        path: __dirname + '/build/renderer/',
        publicPath: '/',
        filename: '[name].[hash].js'
    },

    plugins: [
        new webpack.DefinePlugin({
            ELECTRON: JSON.stringify(true),
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].css',
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/src/static/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: __dirname + '/assets/icon.png',
                to: __dirname + '/build/icon.png',
            }]
        })
    ],

    module: {
          rules: [
            { test: /\.png$/, loader: 'url-loader' },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  MiniCssExtractPlugin.loader,
                  // Creates `style` nodes from JS strings
                  // 'style-loader',
                  // Translates CSS into CommonJS
                  'css-loader',
                  // Compiles Sass to CSS
                  'sass-loader',
                ],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
};
