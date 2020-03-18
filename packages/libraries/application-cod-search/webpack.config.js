const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool:  'source-map',
    entry: {
        'application': path.resolve(__dirname, './src/index.ts')
    },

    output: {
        globalObject: 'typeof self !== \'undefined\' ? self : this',
        path: path.resolve(__dirname, './dist'),
        libraryTarget: 'umd',
        library: 'application',
        umdNamedDefine: true
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/static/index.html',
            hash: true
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
    },

    externals: {
      'react': 'react',
      'react-dom': 'react-dom',
      'react-router': 'react-router'
    }
};
