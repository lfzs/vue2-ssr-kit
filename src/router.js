import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ './view/home.vue')
  },
  {
    name: 'detail',
    path: '/detail',
    component: () => import(/* webpackChunkName: "detail" */ './view/detail.vue')
  },
  { path: '*', component: () => import(/* webpackChunkName: "404" */ './view/404') },
]

export const createRouter = () => new VueRouter({ mode: 'history', routes })
