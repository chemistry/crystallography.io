const path = require('path');
const webpack = require('webpack');
const appJSON = require('./app.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AssetsPlugin = require('assets-webpack-plugin')

module.exports = {
    mode: 'production',
    devtool: 'source-map',

    entry: {
        'application': path.resolve(__dirname, './src/index.ts')
    },

    output: {
        globalObject: 'typeof self !== \'undefined\' ? self : this',
        path: path.resolve(__dirname, './dist'),
        libraryTarget: 'umd',
        library: 'application',
        umdNamedDefine: true,
        filename: '[name].[hash].js'
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
        }),
        new AssetsPlugin({
            filename: 'app.json',
            path: path.join(__dirname, 'dist'),
            includeManifest: true,
            processOutput: function (assets) {
                const manifest = {
                    ...appJSON,
                    resources: assets['application']
                };
                return JSON.stringify(manifest, null, 4);
            }
        })
    ],

    module: {
          rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader'
            },
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
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    externals: {
      'react': 'react',
      'react-dom': 'react-dom',
      'react-router': 'react-router',
      'react-router-config': 'react-router-config',
      'react-router-dom': 'react-router-dom'
    }
};
