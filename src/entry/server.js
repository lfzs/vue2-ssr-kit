import { createApp } from '../app'

export default ctx => {
  return new Promise((resolve, reject) => {
    const { app } = createApp()

    app.$router.push(ctx.url)
    app.$router.onReady(() => {
      const matchedComponents = app.$router.getMatchedComponents() // 当前路由对应的组件(嵌套路由，可能有多个组件)，不包含页面中的组件
      const args = { route: app.$router.currentRoute }

      Promise.all(matchedComponents.map(c => c.asyncData ? c.asyncData(args) : ''))
        .then(data => {
          const result = {}
          matchedComponents.map((c, index) => result[c.name] = data[index])
          ctx.state = result // 通过组件的 name 属性挂载所有的服务端数据
          resolve(app)
        }).catch(reject)
    }, reject)
  })
}
