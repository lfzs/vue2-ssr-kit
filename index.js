const fs = require('fs')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)

const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('./dist/server/vue-ssr-server-bundle')
const clientManifest = require('./dist/client/vue-ssr-client-manifest')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  clientManifest,
  template: fs.readFileSync(resolve('./public/index.html'), 'utf-8'),
})

const Koa = require('koa')
const koaStatic = require('koa-static')
const favicon = require('koa-favicon')

const koa = new Koa()
koa.use(koaStatic(resolve('./dist/client')))
koa.use(favicon(resolve('./public/favicon.ico')))
koa.use(async ctx => ctx.body = await renderer.renderToString(ctx))

koa.listen(3000)
