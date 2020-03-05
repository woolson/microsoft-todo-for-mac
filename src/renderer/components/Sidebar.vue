<template lang="pug">
div.sidebar
  div.sidebar__header
  div.sidebar__add
    el-tooltip(
      slot="right"
      :content="$t('folder.create')"
      placement="right"
    )
      i.task-add.iconfont.icon-add(
        @click="updateState({\
          showTaskFolderAddModal: true,\
          isCreateFolder: true\
        })"
      )
  div.sidebar__folders
    template(v-for="item in compFolders")
      div.sidebar__separate(v-if="item.Key === 'Spacer'")
      TaskFolderItem(:data="item" v-else)
  div.sidebar__setting(
    v-if="!showCalendarView"
    @click="updateState({showSettingsModal: true})"
  )
    i.iconfont.icon-setting
    span.u-ml5 {{$t('base.setting')}}
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import TaskFolderItem from './TaskFolderItem'

export default {
  components: {
    TaskFolderItem
  },

  computed: {
    ...mapState([
      'tasks',
      'taskFolders',
      'showCalendarView',
      'showPlannedFolder',
      'showImportanceFolder'
    ]),
    ...mapGetters([
      'folders',
      'currentFolder'
    ]),
    compFolders () {
      const folders = JSON.parse(JSON.stringify(this.folders))
      const processTasks = this.tasks.filter(o => o.Status !== 'Completed')
      folders.forEach(item => {
        if (item.Key) {
          item.number = processTasks.filter(o => o[item.Key] === item.Value).length
        } else {
          item.number = processTasks.filter(o => o.ParentFolderId === item.Id).length
        }
      })
      return folders
    }
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
  // height 100vh
  width 190px
  flex-shrink 0
  box-sizing border-box
  background var(--background-sidebar)
  display flex
  flex-direction column
  transition background .2s

.sidebar__header
  height 40px
  -webkit-app-region drag

.sidebar__add
  padding 0 10px
  $size-text-large
  height 36px
  line-height 36px
  border-radius 5px
  cursor pointer
  color var(--folder-color)
  text-align center
  // margin-bottom 10px
  &:hover
    i
      text-shadow 0 0 5px rgba(black, .15)
  i
    font-size 24px

.sidebar__folders
  flex 1
  overflow auto
  margin 10px 0
  > div
    margin 0 12px 2px
  &::-webkit-scrollbar
    width 0px !important

.sidebar__separate
  margin 10px 25px !important
  border-top 1px solid rgba(black, .1)

.sidebar__setting
  display flex
  align-items center
  margin 0 12px
  margin-top auto
  height 36px
  line-height 36px
  font-size $size-text-medium
  padding 0 12px
  cursor pointer
  user-select none
  color var(--folder-color)
  margin-bottom 20px
</style>
