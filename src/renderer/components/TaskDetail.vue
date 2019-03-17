<template lang="pug">
Model.task-detail(
  v-model="showTaskDetail"
  @cancel="updateState({showTaskDetail: false, currentTaskDetail: null})"
)
  div.task-detail__header.u-bb
    i.iconfont.u-mr10(:class="checkClass")
    h1 {{currentTask.subject}}
    i.iconfont(:class="starClass")
  div.task-detail__content
    div.task-detail__row.u-bb
      i.iconfont.icon-alarm
      div.content(@click="showDatePicker")
        span 选择提醒时间
        el-date-picker(
          ref="picker"
          v-model="remindDateTime"
          type="datetime"
          placeholder="选择日期时间"
        )
    div.task-detail__row.u-bb
      i.iconfont.icon-calendar
      div.content
        span 截止日期
    div.task-detail__row
      i.iconfont.icon-repeat-o
      div.content
        span 重复
  div.task-detail__content
    div.task-detail__row
      i.iconfont.icon-attachment
      div.content
        span 添加文件
  div.task-detail__content
    div.task-detail__row
      div.content
        textarea(placeholder="添加备注")
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Model from './Model'

export default {
  data () {
    return {
      remindDateTime: ''
    }
  },

  components: {
    Model
  },

  computed: {
    ...mapState({
      currentTask: ({global}) => global.currentTask,
      showTaskDetail: ({global}) => global.showTaskDetail
    }),
    titleStyle () {
      const { status } = this.currentTask
      return {
        textDecoration: status === 'completed' ? 'line-through' : 'none',
        color: status === 'completed' ? '#AAAAAA' : ''
      }
    },
    checkClass () {
      return this.currentTask.status === 'completed' ? 'icon-check' : 'icon-check-o'
    },
    starClass () {
      return this.currentTask.importance === 'high' ? 'icon-star' : 'icon-star-o'
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    showDatePicker () {
      this.$refs.picker.focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
// .task-detail
//   padding 20px 10px

.task-detail__header
  padding 15px
  display flex
  align-items center
  margin-bottom 10px
  h1
    flex 1
    font-size 18px
    font-weight normal
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    margin 0
  i
    font-size 20px
    &.icon-check
      color $green
    &.icon-star
      color $yellow

.task-detail__content
  margin 10px
  margin-top 0
  background $background-color
  border-radius 5px

.task-detail__row
  display flex
  align-items center
  min-height 40px
  padding 12px
  box-sizing border-box
  color $text
  font-size 14px
  cursor pointer
  user-select none
  > i
    margin-right 10px
  .content
    flex 1
    display flex
  textarea
    width 100%
    height 60px
    border none
    resize none
    outline none
    font-size 14px
    color $text
    background transparent
  &:hover
    background rgba($blue, .05)
  &:first-child
    border-radius 5px 5px 0 0
  &:last-child
    border-radius 0 0 5px 5px

.el-date-editor
  display none
</style>

