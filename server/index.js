const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const resolve = dir => path.join(__dirname, dir)

const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('./bundle/server/vue-ssr-server-bundle')
const clientManifest = require('./bundle/client/vue-ssr-client-manifest')
const renderer = createBundleRenderer(serverBundle, {
  cache: new LRU({ max: 10000, maxAge: 1000 * 60 * 15 }),
  runInNewContext: false,
  clientManifest,
  template: fs.readFileSync(resolve('./template.html'), 'utf-8'),
})

const express = require('express')
const favicon = require('serve-favicon')
const app = new express()

app.use(favicon(resolve('./favicon.ico')))
app.use(express.static(resolve('./public')))
app.use(express.static(resolve('./bundle/client')))
app.get('*', (req, res) => renderer.renderToString({ url: req.url }).then(html => res.send(html)).catch(error => handleError(error, res)))
app.listen(3000, '127.0.0.1', () => console.log('server started at http://127.0.0.1:3000')) // eslint-disable-line no-console

function handleError(error, res) {
  const status = error?.response?.status
  if (status === 401) res.redirect('/signin')
  else if (status === 404) res.redirect('/404')
  else if (status === 403) res.redirect('/404')
  else res.status(500).send('Internal Server Error')
}
