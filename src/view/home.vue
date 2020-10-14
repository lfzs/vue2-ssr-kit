<template>
  <div @click="say">
    <p>{{ age }}1</p>
    <p>asyncData {{ asyncData }}</p>
    <p>{{ Date.now() | formatTime }}</p>
    <div>
      <img :src="logo" alt="" />
    </div>
    <details />
  </div>
</template>

<script>
  import logo from '@/static/logo.png'

  export default {
    name: 'home',

    comments: {
      detail: import('./detail')
    },

    asyncData() {
      return 668
    },

    data() {
      return {
        age: 33,
        logo,
      }
    },

    methods: {
      sleep(time = 0) {
        return new Promise(resolve => setTimeout(resolve, time))
      },
      say() {}
    },
  }
</script>

<style lang="less" scoped>
  div {
    border: 1px red solid;
  }
</style>
