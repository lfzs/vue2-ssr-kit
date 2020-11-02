const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const { createProxyMiddleware } = require('http-proxy-middleware')
const resolve = dir => path.join(__dirname, dir)

let renderer
const app = express()
createRenderer() // 提前生成 renderer (没有生成 renderer 之前不可以访问 express 路由)
app.use('/app', createProxyMiddleware({ target: 'https://www.example.com', changeOrigin: true, secure: false })) // 代理配置
app.use(favicon(resolve('./server/favicon.ico')))
app.use(express.static('./server/public'))
app.get('*', (req, res) => renderer.renderToString({ url: req.url }).then(html => res.send(html)).catch(error => handleError(error, res)))
app.listen(8080, '0.0.0.0', () => console.log('server started at http://0.0.0.0:8080')) // eslint-disable-line no-console

function handleError(error, res) {
  const status = error?.response?.status

  /* eslint-disable */
  console.error('===================== Server Error =====================')
  console.error(status, error?.response?.data || error)
  /* eslint-enable */

  if (status === 401) res.redirect('/signin')
  else if (status === 404) res.redirect('/404')
  else if (status === 403) res.redirect('/404')
  else res.status(500).send('Internal Server Error')
}

/*
 *
 *
 *
 *
 *
 *  创建 render 给 app 使用
*/
function createRenderer() {
  const webpack = require('webpack')
  const { createBundleRenderer } = require('vue-server-renderer')

  // 更新 renderer
  let [serverBundle, clientManifest] = []
  const update = async () => {
    if (serverBundle && clientManifest) {
      renderer = await createBundleRenderer(serverBundle, { // 更新 renderer
        runInNewContext: false,
        clientManifest,
        template: fs.readFileSync(resolve('./server/template.html'), 'utf-8'),
      })
    }
  }

  //  server (不需要热更新)
  const MFS = require('memory-fs')
  const mfs = new MFS()
  const serverConfig = require('./build/webpack.server.config')
  const serverComplier = webpack(serverConfig)
  serverComplier.outputFileSystem = mfs
  serverComplier.watch({}, (error, stats) => {
    if (error) throw error
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
  clientConfig.entry = ['webpack-hot-middleware/client?quiet=true&reload=true&overlay=false', clientConfig.entry]
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

  const clientComplier = webpack(clientConfig)
  const clientMiddleware = webpackDevMiddleware(clientComplier, { logLevel: 'silent' })
  app.use(clientMiddleware)
  app.use(webpackHotMiddleware(clientComplier)) // 热更新
  clientComplier.hooks.done.tap('done', stats => { // 注册事件
    stats = stats.toJson()
    stats.warnings.forEach(error => console.warn(error)) // eslint-disable-line no-console
    stats.errors.forEach(error => console.error(error)) // eslint-disable-line no-console
    if (stats.errors.length) return

    clientManifest = JSON.parse(clientMiddleware.fileSystem.readFileSync(path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json')))
    update()
  })
}
