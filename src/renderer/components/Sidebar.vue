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
  template(v-for="item in folders")
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
      'taskFolders',
      'currentFolder',
      'showPlannedFolder',
      'showImportanceFolder'
    ]),
    ...mapGetters(['folders'])
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
