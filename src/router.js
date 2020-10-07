import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('./view/home.vue')
  },
  {
    name: 'detail',
    path: '/detail',
    component: () => import('./view/detail.vue')
  },
  { path: '*', component: () => import('./view/404') },
]

export const createRouter = () => new VueRouter({ mode: 'history', routes })
