<template lang="pug">
div.sidebar
  div.sidebar__header
  div.sidebar__add
    el-tooltip(
      slot="right"
      content="新建清单"
      placement="right"
    )
      i.task-add.iconfont.icon-add(
        @click="updateState({showTaskFolderAddModel: true})"
      )
  TaskFolderItem(
    v-show="showImportanceFolder"
    :data="{Name: '重要', Key: 'Importance', Value: 'High'}"
  )
  TaskFolderItem(
    v-show="showScheduleFolder"
    :data="{Name: '计划日程', Key: 'IsReminderOn', Value: true}"
  )
  div.sidebar__separate(
    v-show="showScheduleFolder || showImportanceFolder"
  )
  TaskFolderItem(
    v-for="item in taskFolders"
    :data="item"
    :key="item.Id"
  )
  div.sidebar__setting(@click="updateState({showSettingsModel: true})")
    i.iconfont.icon-setting
    span.u-ml5 设置
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import TaskFolderItem from './TaskFolderItem'

export default {
  components: {
    TaskFolderItem
  },

  computed: {
    ...mapState({
      taskFolders: ({global}) => global.taskFolders,
      currentFolder: ({global}) => global.currentFolder,
      showScheduleFolder: ({global}) => global.showScheduleFolder,
      showImportanceFolder: ({global}) => global.showImportanceFolder
    })
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
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
  background linear-gradient(45deg, $purple, $blue)
  display flex
  flex-direction column

.sidebar__header
  height 50px
  -webkit-app-region drag

.sidebar__add
  padding 0 10px
  font-size 16px
  height 36px
  line-height 36px
  border-radius 5px
  cursor pointer
  color white
  text-align center
  margin-bottom 10px
  &:hover
    i
      text-shadow 0 0 5px rgba(black, .15)
  i
    font-size 24px

.sidebar__separate
  margin 5px 0
  border-top 1px solid rgba(black, .1)

.sidebar__setting
  display flex
  align-items center
  margin-top auto
  height 36px
  line-height 36px
  font-size 14px
  padding 0 10px
  cursor pointer
  user-select none
  color white
  margin-bottom 20px
</style>
