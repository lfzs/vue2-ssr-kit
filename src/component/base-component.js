// 自动全局注册 src/component 文件下的组件(注意：只匹配 base-*.vue 命名的组件，其他命名方式不会注册)
import Vue from 'vue'

const requireComponent = require.context('.', false, /base-[\w-]+\.vue$/) // 注意：只匹配 base-*.vue 命名的组件
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  Vue.component(componentName, componentConfig.default || componentConfig)
})
