<template>
  <div>
    <base-nav />
    <img :src="logo" alt="logo" />
    <p v-for="item of asyncData" :key="item.id">{{ item.title }}</p>
  </div>
</template>

<script>
  import logo from '@/static/logo.png'

  export default {
    name: 'home',

    async asyncFetchData({ $axios }) {
      const { data } = await $axios.get('items')
      return data
    },

    data() {
      return {
        asyncData: '',
        logo,
      }
    },
  }
</script>

<style lang="less" scoped>
  img {
    width: 100px;
  }

  div {
    text-align: center;
  }
</style>
