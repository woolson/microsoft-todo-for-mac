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
    i.iconfont.u-mr5.u-s16(
      v-if="shouldShowIcon"
      :class="folderIcon"
    )
    span.u-s18(v-else) {{data.Name.substr(0, 2)}}
    span.task-folder-item__name(v-if="shouldShowIcon") {{data.Name}}
    span.task-folder-item__name(v-else) {{data.Name.substr(2)}}
    span.number.u-mlauto(v-show="data.number") {{data.number}}
</template>

<script>
import { mapState, mapMutations } from 'vuex'

const FOLDER_ICON = {
  '任务': 'icon-task u-red',
  'task': 'icon-task u-red',
  'tasks': 'icon-task u-red',
  'Task': 'icon-task u-red',
  '重要': 'icon-star u-yellow',
  'Importance': 'icon-star u-yellow',
  'importance': 'icon-star u-yellow',
  '已计划日程': 'icon-calendar-o u-red',
  'Planned': 'icon-calendar-o u-red',
  'planned': 'icon-calendar-o u-red'
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
    },
    shouldShowIcon () {
      const ranges = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
      const start = this.data.Name.substr(0, 2)
      return !start.match(ranges)
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
  height 35px
  line-height 35px
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
