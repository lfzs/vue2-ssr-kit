<template>
  <div @click="say">detail {{ asyncData }}</div>
</template>

<script>
  export default {
    name: 'detail',

    data() {
      return {
        asyncData: '',
      }
    },

    asyncData() {
      return 'detail'
    },

    methods: {
      say() {}
    },
  }
</script>
