import Vue from 'vue'

Vue.mixin({
  beforeMount() {
    if (window.__INITIAL_STATE__) {
      const { asyncData, name } = this.$options
      if (asyncData) this.asyncData = Object.freeze(window.__INITIAL_STATE__[name])
    }
  }
})
