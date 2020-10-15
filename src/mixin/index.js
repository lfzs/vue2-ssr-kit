import Vue from 'vue'

Vue.mixin({
  beforeMount() {
    if (window.__INITIAL_STATE__) {
      const { asyncFetchData, name } = this.$options
      if (asyncFetchData) this.asyncData = Object.freeze(window.__INITIAL_STATE__[name])
    }
  }
})
