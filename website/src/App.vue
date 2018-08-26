<template lang="pug">
div(id="app")
  Home
</template>

<script>
import Home from './components/home.vue'

export default {
  name: 'App',

  components: {
    Home
  }
}
</script>

<style lang="stylus">
#app
  font-family PingFangSC, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color $font
</style>
