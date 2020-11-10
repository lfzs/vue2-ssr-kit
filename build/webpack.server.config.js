const { merge } = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const isDev = process.env.APP_ENV === 'development'
const resolve = dir => require('path').join(__dirname, dir)

module.exports = merge(base, {
  entry: resolve('../src/entry/server.js'),
  target: 'node',
  externals: nodeExternals({ allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i] }), // 服务端排除掉 node_module 中的依赖，所以 server/ 文件夹下需要安装 client 的 dependencies 依赖
  devtool: isDev && 'source-map',

  output: {
    path: resolve('../server/bundle/server'),
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new VueSSRServerPlugin()
  ],
  module: {
    rules: [
      { test: /\.(le|sc|c)ss$/, use: 'null-loader' }, // 服务端不处理 css 文件
    ]
  },
})
