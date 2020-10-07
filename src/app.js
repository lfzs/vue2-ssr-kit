import Vue from 'vue'
import app from '@/app.vue'
import { createRouter } from '@/router'

import { formatTime } from '@/filter'
Vue.filter('formatTime', formatTime) // 客户端和服务端过滤器

export const createApp = () => {
  return {
    app: new Vue({
      router: createRouter(),
      render: h => h(app),
    })
  }
}
