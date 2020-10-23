<template>
  <div>
    <base-nav />
    <img :src="logo" alt="logo" />
    <p v-for="item of asyncData" :key="item.id">{{ item.title }}</p>
    <el-button type="primary" icon="el-icon-search">搜索</el-button>
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

    async mounted() {
      await $app.$axios.get('user')
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
