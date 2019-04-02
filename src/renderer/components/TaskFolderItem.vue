<template lang="pug">
div.task-folder-item(
  ref="root"
  :class="activeClass"
  @click="updateState({currentFolder: data})"
)
  i.iconfont(:class="folderIcon")
  el-tooltip.u-ml5(
    effect="dark"
    :content="data.Name"
    placement="right"
    :open-delay="500"
  )
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
  '重要': 'icon-star',
  'Importance': 'icon-star',
  'importance': 'icon-star',
  '计划日程': 'icon-calendar-o',
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
  margin 1px 0
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
  &:hover
    text-shadow 0 0 5px rgba(black, .5)
  .number
    opacity .8

.task-folder-item__name
  width 95px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
</style>
