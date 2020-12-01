<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$get($route, 'meta.keepAlive')" />
    </keep-alive>
    <router-view v-if="!$get($route, 'meta.keepAlive')" />
  </div>
</template>

<script>
  import 'normalize.css'
  import '@/style/app.less'

  export default {
    name: 'app',
  }
</script>
