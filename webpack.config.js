const webpack = require('webpack');
const resolve = require('path').resolve;

module.exports = {
  mode: 'production',
  devtool: 'cheap-source-map',
  entry: {
    'plugin.layout.dagre': './src/index.js',
  },
  output: {
    filename: substitutions => `${substitutions.chunk.name}.js`,
    library: '[name]',
    libraryTarget: 'umd',
    path: resolve(__dirname, 'build/')
  },
  externals: {
    '@antv/g6': {
      root: 'G6',
      commonjs2: '@antv/g6',
      commonjs: '@antv/g6',
      amd: '@antv/g6'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      },
    ]
  }
}
