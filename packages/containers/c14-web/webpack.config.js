const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {

    mode: process.env.WEBPACK_DEV_SERVER ? 'development' : 'production',

    devtool:  'source-map',

    entry: {
        'main': path.resolve(__dirname, './src/frontend/app.tsx')
    },

    output: {
        path: __dirname + '/dist/static/',
        publicPath: '/',
        filename: '[name].[contenthash].js'
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            },
        }),
        ... (process.env.WEBPACK_DEV_SERVER ? [
          new WebpackManifestPlugin({
              fileName: 'manifest.json',
          })
        ]: ([
          // new webpack.ExtendedAPIPlugin(),
          new InjectManifest({
              swSrc:  path.resolve(__dirname, 'src/frontend/service-worker.ts'),
              swDest: path.resolve(__dirname, 'dist/static/service-worker.js'),
              include:[
                  /\.html$/,
                  /\.js$/,
                  /\.css$/,
                  /\.woff2$/,
                  /\.jpg$/,
                  /\.png$/,
                  /\.svg$/
              ]
          }),
          new WebpackManifestPlugin({
              fileName: 'manifest.json',
              generate: (seed, files, entrypoints) => {
                const manifestFiles = files.reduce((manifest, file) => {
                  if (file.name.endsWith('.d.ts')) {
                      return manifest;
                  }
                  manifest[file.name] = file.path;
                  return manifest;
                }, seed);
                const entrypointFiles = entrypoints.main.filter(
                  fileName => !fileName.endsWith('.map')
                );

                return {
                  "short_name": "COD Search",
                  "name": "Crystal Structure Search",
                  "description": "Crystal Structure Search Online",
                  "icons": [
                      {
                        "src": "icon-48.png",
                        "type": "image/png",
                        "sizes": "48x48"
                      },
                      {
                        "src": "icon-96.png",
                        "type": "image/png",
                        "sizes": "96x96"
                      },
                      {
                        "src": "icon-192.png",
                        "type": "image/png",
                        "sizes": "192x192"
                      },
                      {
                        "src": "icon-512.png",
                        "type": "image/png",
                        "sizes": "512x512"
                      }
                  ],
                  "files": manifestFiles,
                  "entrypoints": entrypointFiles,
                  "background_color": "#F4F6F9",
                  "start_url": "/",
                  "display": "standalone",
                  "theme_color": "#0E4575",
                  "scope": "/"
                };
              },
          }),
        ])),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].css',
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/src/static/index.html',
            favicon: __dirname + '/src/static/favicon.ico',
        }),
        new CopyWebpackPlugin({
          patterns: [{
                from: __dirname + '/src/static/favicon.ico'
            }, {
                from: __dirname + '/src/static/icon-48.png'
            }, {
                from: __dirname + '/src/static/icon-96.png'
            }, {
                from: __dirname + '/src/static/icon-192.png'
            }, {
                from: __dirname + '/src/static/icon-512.png'
            }, {
                from: __dirname + '/src/static/robots.txt'
            }]
      }),
    ],

    module: {
          rules: [
            { test: /\.(woff|woff2|ttf|eot)/, loader: 'url-loader' },
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
                test: /\.css$/i,
                use: [
                  MiniCssExtractPlugin.loader,
                  // 'style-loader',
                  'css-loader'
                ],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.svg']
    },

    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api/v1/autocomplete': {
                target: 'https://crystallography.io',
                changeOrigin: true
            }
        }
    }
};
