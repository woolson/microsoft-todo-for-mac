<template lang="pug">
div.task-item.u-bb(
  ref="root"
  :class="{active: currentTask.Id === data.Id}"
  @click="updateState({currentTask: data, showTaskDetailModal: true})"
)
  i.iconfont.u-mr15(
    :class="checkClass"
    @click.stop="changeTaskStatus"
  )
  div.task-item__content
    h1(:style="titleStyle") {{data.Subject}}
    div.task-item__info(v-show="data.IsReminderOn || data.Body.Content")
      i.iconfont.icon-bell(
        v-show="data.IsReminderOn"
        :title="$t('base.remind')"
      )
      i.iconfont.icon-note(
        v-show="data.Body.Content"
        :title="$t('base.note')"
      )
  i.iconfont.u-ml10(
    :class="starClass"
    @click.stop="changeTaskImportance"
  )
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapState([
      'theme',
      'currentTask'
    ]),
    titleStyle () {
      const { Status } = this.data
      return {
        textDecoration: Status === 'Completed' ? 'line-through' : 'none',
        color: Status === 'Completed'
          ? this.theme === 'dark' ? '#666666 !important' : '#AAAAAA !important'
          : ''
      }
    },
    checkClass () {
      return this.data.Status === 'Completed' ? 'icon-check' : 'icon-check-o'
    },
    starClass () {
      return this.data.Importance === 'High' ? 'icon-star' : 'icon-star-o'
    }
  },

  watch: {
    currentTask: {
      handler () {
        if (this.data.Id === this.currentTask.Id) {
          this.$refs.root.scrollIntoViewIfNeeded()
        }
      },
      deep: true
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    ...mapActions({
      updateTask: 'UPDATE_TASK'
    }),
    async changeTaskStatus () {
      try {
        await this.updateTask({
          Id: this.data.Id,
          Status: this.data.Status === 'Completed' ? 'NotStarted' : 'Completed'
        })
        this.$message.success(this.$t('message.updateSuccessfully'))
      } catch (err) {
        this.$message.error(this.$t('message.updateFailed'))
      }
    },
    async changeTaskImportance () {
      try {
        await this.updateTask({
          Id: this.data.Id,
          Importance: this.data.Importance === 'High' ? 'Normal' : 'High'
        })
        this.$message.success(this.$t('message.updateSuccessfully'))
      } catch (err) {
        this.$message.error(this.$t('message.updateFailed'))
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-item
  display flex
  align-items center
  background $background-color
  padding 11px 15px
  background-size 0px 100%
  position relative
  transition all .2s
  cursor pointer
  user-select none
  box-sizing border-box
  > div
    flex 1
  > i
    &.icon-check
    &.icon-check-o
      font-size 20px
    &.icon-check
      color $green
      animation bounceIn .75s
    &.icon-star
      color $yellow
      animation bounceIn .75s
    &:hover
      animation bounceIn .75s
  &:first-child
    border-top-left-radius 5px
    border-top-right-radius 5px
  &:last-child
    border-bottom-left-radius 5px
    border-bottom-right-radius 5px
    &:after
      display none
  &.active
    *
      color white !important
    background linear-gradient(45deg, $blue, $purple)
    .task-item__info
      background rgba(black, .1)
  &:hover:not(.active)
    background rgba($blue, .15)

.task-item__content
  h1
    font-size 14px
    line-height 1
    font-weight normal
    margin 0
    color $text

.task-item__info
  // width 100%
  display inline-block
  width auto
  margin-top 6px
  background rgba(white, .4)
  padding 3px 8px
  padding-right 0px
  border-radius 4px
  box-sizing border-box
  transition all .2s
  i
    margin-right 10px
    font-size 12px
    color $text
    &.icon-bell
      font-size 13px
</style>
