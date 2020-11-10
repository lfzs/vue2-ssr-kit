const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isDev = process.env.APP_ENV === 'development'
const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  output: {
    filename: `js/${isDev ? '[name]' : '[hash]'}.js`,
    chunkFilename: `js/${isDev ? 'chunk.[name]' : '[contenthash]'}.js`,
    publicPath: '/',
  },
  mode: isDev ? 'development' : 'production',
  resolve: {
    alias: { '@': resolve('../src') },
    extensions: ['.js', '.json', '.vue'],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new StyleLintPlugin({ files: '**/*.{vue,html,css,less,scss,sass}', context: resolve('../src'), emitWarning: isDev, emitError: !isDev }),
    new ESLintPlugin({ files: '**/*.{js,vue}', context: resolve('../src'), emitWarning: isDev, emitError: !isDev }),
    new webpack.EnvironmentPlugin(['APP_ENV']),
    new webpack.ProgressPlugin(),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader', exclude: /node_modules/ },
      { test: /\.js$/, use: 'babel-loader?cacheDirectory=true', exclude: /node_modules/ },
      { test: /\.(png|jpg|gif|jpeg|svg|woff|woff2|eot|ttf|otf)$/, use: [{ loader: 'file-loader', options: { name: 'static/[contenthash].[ext]', esModule: false } }] },
    ]
  },

  performance: {
    hints: false,
  },
}
