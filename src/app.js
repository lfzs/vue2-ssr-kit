import Vue from 'vue'
import App from '@/app.vue'
import { createRouter } from '@/Router'
import { axios } from '@/util'

Vue.prototype.$axios = axios

import { formatTime } from '@/filter'
Vue.filter('formatTime', formatTime)

export const createApp = () => {
  const router = createRouter()
  const app = new Vue({ router, render: h => h(App) })

  if (process.env.browser) window.$app = app // 客户端全局挂载实例
  return { app }
}
