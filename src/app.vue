<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$get($route, 'meta.keepAlive')" />
    </keep-alive>
    <router-view v-if="!$get($route, 'meta.keepAlive')" />
  </div>
</template>

<script>
  export default {
    name: 'app',
  }
</script>
