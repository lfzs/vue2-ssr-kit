<template>
  <div>
    <h1>登陆</h1>
    <input v-model="mobile" />
    <input v-model="password" />
    <el-button @click="signin">登陆</el-button>
  </div>
</template>

<script>
  import { authStore } from '@/store'

  export default {
    name: 'signin',
    data() {
      return {
        mobile: '',
        password: '',
      }
    },

    mounted() {
      const { next } = this.$route.query
      next && authStore.setNext(next)
    },

    methods: {
      async signin() {
        await authStore.signin({ mobile: this.mobile, password: this.password })
        authStore.signinNext()
      },
    },

  }
</script>
