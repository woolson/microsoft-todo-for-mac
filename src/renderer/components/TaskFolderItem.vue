<template lang="pug">
div.task-folder-item(
  :class="{active: currentFolder.Id === data.Id}"
  @click="updateState({currentFolder: data})"
)
  i.iconfont(:class="folderIcon")
  span.u-ml5 {{data.Name}}
</template>

<script>
import { mapState, mapMutations } from 'vuex'

const FOLDER_ICON = {
  '任务': 'icon-task',
  'task': 'icon-task',
  'tasks': 'icon-task',
  'Task': 'icon-task',
  '重要': 'icon-star',
  'Importance': 'icon-star',
  'importance': 'icon-star'
}

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapState({
      currentFolder: ({global}) => global.currentFolder
    }),
    folderIcon () {
      return FOLDER_ICON[this.data.Name] || 'icon-list'
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
.task-folder-item
  height 36px
  line-height 36px
  font-size 14px
  border-radius 5px
  padding 0 10px
  cursor pointer
  user-select none
  color white
  display flex
  align-items center
  transition all .2s
  i
    font-size 18px
    &.icon-star
      margin-left 1px
      font-size 15px
      margin-right 1px
  &.active
    box-shadow inset 0 0 12px rgba(black, .05)
    background rgba(black, .1)
</style>
