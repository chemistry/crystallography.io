const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',

    devtool:  'source-map',

    entry: {
        'index': path.resolve(__dirname, './src/frontend/index.tsx')
    },

    output: {
      path: __dirname + '/dist/static/',
      publicPath: '/',
      filename: '[hash].js'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/static/index.html'
        })
    ],

    module: {
          rules: [
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
