import 'es6-promise/auto' // 一些第三方包会依赖 Promise 环境

import Vue from 'vue'
import _ from 'lodash'
import App from '@/app.vue'
import { createRouter } from '@/Router'
import { axios } from '@/util'

import '@/component/base-component' // 组件全局注册
import '@/component/element-ui' // element 组件全局注册

Vue.prototype.$axios = axios
Vue.prototype.$get = _.get
Vue.config.productionTip = false

import { formatTime } from '@/filter'
Vue.filter('formatTime', formatTime)

export const createApp = () => {
  const router = createRouter()
  const app = new Vue({ name: 'app', router, render: h => h(App) })

  if (process.env.browser) {
    window.$app = app // 客户端全局挂载实例

    // 根元素添加 --vh 变量
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    window.addEventListener('resize', () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`))

  }
  return { app }
}
