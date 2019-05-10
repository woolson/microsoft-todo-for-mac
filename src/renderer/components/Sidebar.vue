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
        @click="updateState({showTaskFolderAddModal: true})"
      )
  div.sidebar__folders
    template(v-for="item in compFolders")
      div.sidebar__separate(v-if="item.Key === 'Spacer'")
      TaskFolderItem(:data="item" v-else)
  div.sidebar__setting(@click="updateState({showSettingsModal: true})")
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
      'currentFolder',
      'showPlannedFolder',
      'showImportanceFolder'
    ]),
    ...mapGetters(['folders']),
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
  height 100vh
  width 190px
  box-sizing border-box
  box-shadow inset 0 0 5px rgba(black, .15)
  background var(--background-sidebar)
  display flex
  flex-direction column
  transition background .2s

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

.sidebar__folders
  flex 1
  overflow auto
  margin 10px 0
  > div
    margin 0 12px
  &::-webkit-scrollbar
    width 0px !important

.sidebar__separate
  margin 5px !important
  border-top 1px solid rgba(black, .1)

.sidebar__setting
  display flex
  align-items center
  margin 0 12px
  margin-top auto
  height 36px
  line-height 36px
  font-size 14px
  padding 0 12px
  cursor pointer
  user-select none
  color white
  margin-bottom 20px
</style>
