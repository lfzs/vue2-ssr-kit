import '@/mixin' // 只在客户端混入，提取数据到 asyncData 中

import { createApp } from '@/app'
const { app } = createApp()

app.$router.onReady(() => {
  app.$mount('#app')
})
