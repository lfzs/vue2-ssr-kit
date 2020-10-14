const { merge } = require('webpack-merge')
const base = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.env.APP_ENV === 'development'
const resolve = dir => require('path').join(__dirname, dir)

module.exports = merge(base, {
  entry: resolve('../src/entry/client.js'),
  devtool: isDev && 'eval-cheap-source-map',

  output: {
    path: resolve('../dist/client'),
  },

  plugins: [
    // new BundleAnalyzerPlugin(),
    new VueSSRClientPlugin(),
  ],
})
