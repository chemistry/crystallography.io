const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config');

const plugins = baseConfig.plugins ? baseConfig.plugins : [];
plugins.push(new HtmlWebpackPlugin());

module.exports = {
    ...baseConfig,
    plugins: plugins
}
