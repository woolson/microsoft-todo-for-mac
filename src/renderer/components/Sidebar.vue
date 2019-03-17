<template lang="pug">
div.sidebar
  div.sidebar__header
  TaskFolderItem(
    v-for="item in taskFolders"
    :data="item"
    :key="item.id"
  )
  div.task-add 新建清单
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TaskFolderItem from './TaskFolderItem'

export default {
  components: {
    TaskFolderItem
  },

  computed: {
    ...mapState({
      taskFolders: ({global}) => global.taskFolders,
      currentFolder: ({global}) => global.currentFolder
    })
  },

  watch: {
    currentFolder: {
      handler: 'getTasks',
      deep: true
    }
  },

  methods: {
    ...mapActions({
      getTasks: 'GET_TASKS'
    })
  }
}
</script>

<style lang="stylus" scoped>
.sidebar
  height 100vh
  width 160px
  padding 0 10px
  box-sizing border-box
  box-shadow inset 0 0 5px rgba(black, .15)
  background linear-gradient(45deg, #765ee7, #1c9fff)

.sidebar__header
  height 50px
  -webkit-app-region drag

.task-add
  padding 0 10px
  font-size 16px
  color $red
  height 36px
  line-height 36px
  border-radius 5px
  cursor pointer
  &:hover
    background $red
    color white
</style>
