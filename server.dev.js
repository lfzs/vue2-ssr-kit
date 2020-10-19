const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const resolve = dir => path.join(__dirname, dir)

let renderer
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

  try {
    const html = await renderer.renderToString({ url: req.url })
    res.send(html)
  } catch (error) {
    // TODO production 日志记录
    const status = error?.response?.status
    if (status === 401) res.redirect('/signin')
    else if (status === 404) res.redirect('/404')
    else if (status === 403) res.redirect('/404')
    else res.status(500).send('Internal Server Error')
  }
})

app.listen(8080, '0.0.0.0')

/**
 *
 *
 *
 *
 *
 *  创建 render 给 app 使用
*/
function updateRenderer() {
  const webpack = require('webpack')
  const { createBundleRenderer } = require('vue-server-renderer')

  // 更新 renderer
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

  //  server (不需要热更新)
  const MFS = require('memory-fs')
  const mfs = new MFS()
  const serverConfig = require('./build/webpack.server.config')
  const serverComplier = webpack(serverConfig)
  serverComplier.outputFileSystem = mfs
  serverComplier.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) return
    serverBundle = JSON.parse(mfs.readFileSync(path.join(serverConfig.output.path, 'vue-ssr-server-bundle.json')))
    update()
  })

  // client
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const clientConfig = require('./build/webpack.client.config')

  // 修改入口 -> 热更新
  clientConfig.entry = ['webpack-hot-middleware/client?reload=true&overlay=false', clientConfig.entry]
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

  const clientComplier = webpack(clientConfig)
  const clientMiddleware = webpackDevMiddleware(clientComplier, { logLevel: 'silent' })
  app.use(clientMiddleware)
  app.use(webpackHotMiddleware(clientComplier)) // 热更新
  clientComplier.hooks.done.tap('done', stats => { // 注册事件
    stats = stats.toJson()
    stats.warnings.forEach(err => console.warn(err)) // eslint-disable-line no-console
    stats.errors.forEach(err => console.error(err)) // eslint-disable-line no-console
    if (stats.errors.length) return

    clientManifest = JSON.parse(clientMiddleware.fileSystem.readFileSync(path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json')))
    update()
  })
}
