import Vue from 'vue'
import App from '@/app.vue'
import { createRouter } from '@/Router'
import { axios } from '@/util'

import '@/component/base-component' // 组件全局注册
import '@/component/element-ui' // element 组件全局注册

Vue.prototype.$axios = axios
Vue.config.productionTip = false

import { formatTime } from '@/filter'
Vue.filter('formatTime', formatTime)

export const createApp = () => {
  const router = createRouter()
  const app = new Vue({ router, render: h => h(App) })

  if (process.env.browser) window.$app = app // 客户端全局挂载实例
  return { app }
}
