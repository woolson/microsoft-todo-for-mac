<template lang="pug">
el-tooltip(
  effect="dark"
  :content="data.Name"
  placement="right"
  :open-delay="1000"
)
  div.task-folder-item(
    ref="root"
    :class="activeClass"
    @click="updateState({currentFolder: data})"
  )
    i.iconfont.u-mr5(:class="folderIcon")
    span.task-folder-item__name {{data.Name}}
    span.number.u-mlauto {{data.number}}
</template>

<script>
import { mapState, mapMutations } from 'vuex'

const FOLDER_ICON = {
  '任务': 'icon-task',
  'task': 'icon-task',
  'tasks': 'icon-task',
  'Task': 'icon-task',
  '重要': 'icon-star u-yellow',
  'Importance': 'icon-star u-yellow',
  'importance': 'icon-star u-yellow',
  '已计划日程': 'icon-calendar-o',
  'Planned': 'icon-calendar-o',
  'planned': 'icon-calendar-o'
}

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapState([
      'currentFolder'
    ]),
    folderIcon () {
      return FOLDER_ICON[this.data.Name] || 'icon-list'
    },
    activeClass () {
      if (this.data.Id) {
        return { active: this.currentFolder.Id === this.data.Id }
      } else {
        return { active: this.currentFolder.Key === this.data.Key }
      }
    }
  },

  watch: {
    currentFolder: {
      handler () {
        const { data, currentFolder } = this
        const caseId = (data.Id === currentFolder.Id && data.Id)
        const caseKey = (data.Key === currentFolder.Key && data.Key)
        if (caseId || caseKey) {
          this.$refs.root.scrollIntoViewIfNeeded()
        }
      },
      deep: true
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
  height 40px
  line-height 40px
  font-size 14px
  border-radius 5px
  padding 0 12px
  cursor pointer
  user-select none
  color var(--folder-color)
  display flex
  align-items center
  // transition all .2s
  margin 1px 0
  outline none
  i
    font-size 18px
    &.icon-star
      margin-left 1px
      font-size 15px
      margin-right 1px
    &.icon-calendar-o
      font-size 16px
  &.active
    background var(--folder-background)

.task-folder-item__name
  width 95px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  outline none
</style>
