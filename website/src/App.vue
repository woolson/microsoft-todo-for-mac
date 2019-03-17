<template lang="pug">
div(id="app")
  router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color $font
</style>
