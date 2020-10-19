import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    alias: ['/index', '/index.html'],
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

export const createRouter = () => new VueRouter({ mode: 'history', routes })
