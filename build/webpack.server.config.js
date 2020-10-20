const { merge } = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const isDev = process.env.APP_ENV === 'development'
const resolve = dir => require('path').join(__dirname, dir)

module.exports = merge(base, {
  entry: resolve('../src/entry/server.js'),
  target: 'node',
  externals: nodeExternals({ allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i] }),
  devtool: isDev && 'source-map',

  output: {
    path: resolve('../server/bundle/server'),
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new VueSSRServerPlugin()
  ],
})
