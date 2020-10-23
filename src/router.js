import Vue from 'vue'
import VueRouter from 'vue-router'
import { APP_NAME } from '@/constant'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    alias: ['/index', '/index.html'],
    meta: { title: 'Home' },
    component: () => import(/* webpackChunkName: "home" */ '@/view/home.vue')
  },
  {
    path: '/detail',
    component: () => import(/* webpackChunkName: "detail" */ '@/view/detail.vue')
  },
  {
    path: '/signin',
    component: () => import(/* webpackChunkName: "signin" */ '@/view/signin.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "404" */ '@/view/404.vue')
  },
]

export const createRouter = () => {
  const router = new VueRouter({ mode: 'history', routes })

  if (process.env.browser) {
    router.beforeEach((to, from, next) => {
      document.title = to.meta.title ?? APP_NAME
      next()
    })
  }
  return router
}
