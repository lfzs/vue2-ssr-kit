import Vue from 'vue'

Vue.mixin({
  name: 'mixin',
  // 组件挂载后，把服务端数据更新当前组件的 this.asyncData
  mounted() {
    if (window.__INITIAL_STATE__) {
      const { asyncFetchData, name } = this.$options
      if (asyncFetchData) this.asyncData = Object.freeze(window.__INITIAL_STATE__[name])
    }
  },
})
