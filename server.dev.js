const fs = require('fs')
const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const express = require('express')
const favicon = require('serve-favicon')
const resolve = dir => path.join(__dirname, dir)

let renderer, host = '0.0.0.0', port = 8080
const app = express()
updateRenderer()

app.use(favicon(resolve('./public/favicon.ico')))
app.get('*', async (req, res) => {
  if (!renderer) { // 轮询检查 redner 是否存在
    let timer = null
    await new Promise(success => {
      timer = setInterval(() => {
        if (renderer) {
          clearInterval(timer)
          success()
        }
      }, 300)
    })
  }
  const html = await renderer.renderToString({ url: req.url })
  res.send(html)
})

app.listen(port, host)

// 创建 render 给 app 使用
function updateRenderer() {
  const webpack = require('webpack')
  const { createBundleRenderer } = require('vue-server-renderer')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  const clientConfig = require('./build/webpack.client.config')
  const serverConfig = require('./build/webpack.server.config')

  let [serverBundle, clientManifest] = []
  const update = async () => {
    if (serverBundle && clientManifest) {
      renderer = await createBundleRenderer(serverBundle, { // 更新 renderer
        runInNewContext: false,
        clientManifest,
        template: fs.readFileSync(resolve('./public/index.html'), 'utf-8'),
      })
    }
  }

  // 打包 serverBundle
  const serverComplier = webpack(serverConfig)
  const serverMiddleware = webpackDevMiddleware(serverComplier, { logLevel: 'silent' })
  app.use(serverMiddleware)

  serverComplier.hooks.done.tap('serverDone', stats => { // 注册事件
    stats.hasErrors() && console.error('serverError', stats.toJson().errors) // eslint-disable-line no-console
    stats.hasWarnings() && console.warn('serverWarning', stats.toJson().warnings) // eslint-disable-line no-console
    serverBundle = JSON.parse(serverMiddleware.fileSystem.readFileSync(path.join(serverConfig.output.path, 'vue-ssr-server-bundle.json')))
    update()
  })

  // 修改入口 -> 热更新
  clientConfig.entry = ['webpack-hot-middleware/client?reload=true', clientConfig.entry]
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

  clientConfig.plugins.push(new FriendlyErrorsWebpackPlugin({ compilationSuccessInfo: { messages: [`Your server is running here http://${host}:${port}`] } }))

  const clientComplier = webpack(clientConfig)
  const clientMiddleware = webpackDevMiddleware(clientComplier, { logLevel: 'silent' })
  app.use(clientMiddleware)
  app.use(webpackHotMiddleware(clientComplier, { log: false })) // 热更新，加载一次就行
  clientComplier.hooks.done.tap('clientDone', stats => { // 注册事件
    stats.hasErrors() && console.error('clientError', stats.toJson().errors) // eslint-disable-line no-console
    stats.hasWarnings() && console.warn('clientWarning', stats.toJson().warnings) // eslint-disable-line no-console
    clientManifest = JSON.parse(clientMiddleware.fileSystem.readFileSync(path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json')))
    update()
  })
}
