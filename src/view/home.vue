<template>
  <div @click="say">
    <p>{{ age }}</p>
    <p>asyncData {{ asyncData }}</p>
    <p>{{ Date.now() | formatTime }}</p>
    <div>
      <img :src="logo" alt="logo" />
    </div>
    <detail />
  </div>
</template>

<script>
  import logo from '@/static/logo.png'
  import detail from './detail'

  export default {
    name: 'home',

    components: {
      detail,
    },

    async asyncFetchData({ $axios }) {
      await Promise.all([
        $axios.get('admin_users'),
      ])
      return 668
    },

    async mounted() {
    },

    data() {
      return {
        age: 33,
        asyncData: '',
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
