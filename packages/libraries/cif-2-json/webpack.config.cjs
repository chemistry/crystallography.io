const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    'cif-2-json': path.resolve(__dirname, './src/index.ts'),
  },
  output: {
    globalObject: "typeof self !== 'undefined' ? self : this",
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'umd',
    library: 'cif-2-json',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};
