<template lang="pug">
div.task-detail-main
  div.task-detail__header.u-bb
    i.iconfont.u-mr10(:class="checkClass")
    h1(:style="titleStyle") {{currentTask.subject}}
    i.iconfont(:class="starClass")
  div.task-detail__content
    div.task-detail__row.u-bb
      i.iconfont.icon-alarm
      div.content(@click.stop="showRemindPicker")
        span {{remindDateText}}
        el-date-picker(
          ref="remindPicker"
          v-model="dateTime"
          type="datetime"
        )
    div.task-detail__row.u-bb(@click.stop="showStopPicker")
      i.iconfont.icon-calendar
      div.content
        span {{stopDateText}}
        el-date-picker(
          ref="stopPicker"
          v-model="stopDate"
          type="date"
        )
    div.task-detail__row(@click="$emit('update:step', 1)")
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
import { mapState } from 'vuex'
import { dater } from '@/common/utils'

export default {
  data () {
    return {
      dateTime: '',
      stopDate: ''
    }
  },

  computed: {
    ...mapState({
      currentTask: ({global}) => global.currentTask
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
    },
    remindDateText () {
      return this.dateTime ? dater(this.dateTime).format('MM月DD日 HH点mm分 提醒我') : '选择提醒时间'
    },
    stopDateText () {
      return this.stopDate ? dater(this.stopDate).format('MM月DD日 到期') : '截止日期'
    }
  },

  methods: {
    showRemindPicker () {
      const { showPicker, hidePicker, pickerVisible } = this.$refs.remindPicker
      if (pickerVisible) hidePicker()
      else showPicker()
    },
    showStopPicker () {
      const { showPicker, hidePicker, pickerVisible } = this.$refs.stopPicker
      if (pickerVisible) hidePicker()
      else showPicker()
    }
  }
}
</script>

<style lang="stylus" scoped>

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
  width 0px
  // height 0px
  opacity 0
  >>> input
    padding 0
    width 0 !important
    height 0 !important
</style>
