<template>
  <div @click="say">
    <span>{{ age }}</span>
    <p>{{ Date.now() | formatTime }}</p>
    <img :src="logo" alt="" />
  </div>
</template>

<script>
  import logo from '@/static/logo.png'

  export default {
    name: 'home',

    asyncData() {
      return 666
    },

    data() {
      return {
        age: 30,
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
    color: @primary;
    display: flex;
    justify-content: center;
  }
</style>
