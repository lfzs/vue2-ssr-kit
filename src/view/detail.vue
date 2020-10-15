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

    asyncFetchData() {
      return 'detail'
    },

    methods: {
      say() {}
    },
  }
</script>
