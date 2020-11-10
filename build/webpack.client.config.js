const webpack = require('webpack')
const { merge } = require('webpack-merge')
const base = require('./webpack.base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // client production 环境，提取行内的 style 到 .css 文件 利于缓存处理。dev 模式不提取为了热更新, server 不要处理 css
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.APP_ENV === 'development'
const resolve = dir => require('path').join(__dirname, dir)

module.exports = merge(base, {
  entry: resolve('../src/entry/client.js'),
  devtool: isDev && 'eval-cheap-source-map',

  output: {
    path: resolve('../server/bundle/client'),
  },

  plugins: [
    // new BundleAnalyzerPlugin(),
    new VueSSRClientPlugin(),
    new webpack.DefinePlugin({ 'process.env.browser': 'true' }), // 客户端注入环境变量 browser
    ...(isDev ? [] : [new MiniCssExtractPlugin({ filename: 'css/[contenthash].css', chunkFilename: 'css/[contenthash].css' })]),

  ],

  module: {
    rules: [
      { test: /\.css$/, use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
      { test: /\.less$/, use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', { loader: 'less-loader', options: { additionalData: '@import "~@/style/less-var.less";' } }] },
      { test: /\.scss$/, use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', { loader: 'sass-loader', options: { additionalData: '@import "~@/style/sass-var.scss";' } }] },
    ]
  },
})
