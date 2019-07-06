<template lang="pug">
div.index
  Sidebar
  TaskList
</template>

<script>
import Sidebar from '@/components/Sidebar'
import TaskList from '@/components/TaskList'

export default {
  components: {
    Sidebar,
    TaskList
  }
}
</script>

<style lang="stylus" scoped>
.index
  display flex
  flex 1
</style>
