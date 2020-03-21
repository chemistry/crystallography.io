const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        umdNamedDefine: true
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/static/index.html',
            hash: true
        }),
        new AssetsPlugin({
            filename: 'app.json',
            path: path.join(__dirname, 'dist'),
            includeManifest: true,
            processOutput: function (assets) {
                const manifest = {
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
