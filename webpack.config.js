const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // client production 环境，提取行内的 style 到 .css 文件 利于缓存处理。dev 模式不提取为了热更新, server 不要处理 css
const StyleLintPlugin = require('stylelint-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

// https://github.com/webpack-contrib/mini-css-extract-plugin/issues/90#issuecomment-392968392 fix 服务端不能提取 css
class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
  getCssChunkObject() {
    return {}
  }
}

const isDev = process.env.APP_ENV === 'development'
const isServer = process.env.APP_TARGET === 'server'
const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  entry: isServer ? './src/entry/server.js' : './src/entry/client.js',
  target: isServer ? 'node' : 'web',
  externals: isServer ? nodeExternals({ allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i] }) : '',
  devtool: isDev ? (isServer ? 'source-map' : 'eval-cheap-source-map') : false,

  output: {
    path: isServer ? resolve('./dist/server') : resolve('./dist/client'),
    libraryTarget: isServer ? 'commonjs2' : undefined,
    filename: 'js/bundle.[name].[hash:4].js',
    chunkFilename: 'js/chunk.[name].[contenthash:4].js',
    publicPath: '/',
  },
  mode: isDev ? 'development' : 'production',
  resolve: {
    alias: { '@': resolve('./src') },
    extensions: ['.js', '.json', '.vue'],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new StyleLintPlugin({ files: '**/*.{vue,html,css,less,scss,sass}', context: resolve('src'), emitWarning: isDev, emitError: !isDev }),
    new webpack.EnvironmentPlugin(['APP_ENV', 'APP_TARGET']),
    new VueLoaderPlugin(),
    isServer ? new VueSSRServerPlugin() : new VueSSRClientPlugin(),
    ...(isDev ? [] : [new ServerMiniCssExtractPlugin({ filename: 'css/[name].[contenthash:4].css' })]), // 正式环境才提取 css
  ],
  module: {
    rules: [
      { test: /\.(js|vue)$/, use: [{ loader: 'eslint-loader', options: { cache: true, emitWarning: isDev, emitError: !isDev } }], exclude: /node_modules/, include: resolve('src'), enforce: 'pre' },
      { test: /\.vue$/, use: 'vue-loader', exclude: /node_modules/ },
      { test: /\.js$/, use: 'babel-loader?cacheDirectory=true', exclude: /node_modules/ },

      // https://github.com/vuejs/vue-style-loader/issues/46 为什么需要设置 esModule: false
      { test: /\.css$/, use: [isDev ? 'vue-style-loader' : ServerMiniCssExtractPlugin.loader, { loader: 'css-loader', options: { esModule: false } }, 'postcss-loader'] },
      { test: /\.less$/, use: [isDev ? 'vue-style-loader' : ServerMiniCssExtractPlugin.loader, { loader: 'css-loader', options: { esModule: false } }, 'postcss-loader', { loader: 'less-loader', options: { additionalData: '@import "~@/style/less-var.less";' } }] },
      { test: /\.scss$/, use: [isDev ? 'vue-style-loader' : ServerMiniCssExtractPlugin.loader, { loader: 'css-loader', options: { esModule: false } }, 'postcss-loader', { loader: 'sass-loader', options: { additionalData: '@import "~@/style/sass-var.scss";' } }] },

      { test: /\.(png|jpg|gif|jpeg|svg|woff|woff2|eot|ttf|otf)$/, use: [{ loader: 'file-loader', options: { name: 'static/[name].[contenthash:4].[ext]', esModule: false } }] },
    ]
  },

  performance: {
    hints: false,
  },
}
