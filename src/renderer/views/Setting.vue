<template lang="pug">
div.settings
  SettingContent
</template>

<script>
import SettingContent from '../components/SettingContent.vue'

export default {
  components: {
    SettingContent
  }
}
</script>

<style lang="stylus" scoped>
.settings
  flex 1
  background var(--background-content)
  >>> .header
    -webkit-app-region drag
</style>

