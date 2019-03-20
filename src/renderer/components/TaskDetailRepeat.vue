<template lang="pug">
div.task-detail-repeat
  div.task-detail-repeat__header.u-bb
    span.u-pointer(@click="$emit('update:step', 0)") 返回
  div.task-detail-repeat__content
    div.task-detail-repeat__row
      label.u-mr20 重复
      el-select.u-flex-1(v-model="level")
        el-option(
          v-for="item in levelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        )
  div.task-detail-repeat__content(v-show="level === 'custom'")
    div.task-detail-repeat__row
      label.u-mr20 周期
      el-input(v-model="repeatNumber" type="number")
      el-select(v-model="repeatLevel")
        el-option(
          v-for="item in repeatLevelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        )
    div.task-detail-repeat__row(v-show="level === 'Weekly'")
      el-checkbox-group(v-model="customWeek")
        el-checkbox-button(
          v-for="item in weeks"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        )
  el-button(type="primary" plain size="") 确定
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      level: null,
      repeatLevel: null,
      repeatNumber: null,
      customWeek: [],
      levelOptions: [
        { value: 'Daily', label: '每天' },
        { value: 'WeekDays', label: '工作日' },
        { value: 'Weekly', label: '每周' },
        { value: 'AbsoluteMonthly', label: '每月' },
        { value: 'AbsoluteYearly', label: '每年' },
        { value: 'custom', label: '自定义' }
      ],
      repeatLevelOptions: [
        { value: 'day', label: '天' },
        { value: 'week', label: '周' },
        { value: 'month', label: '月' },
        { value: 'year', label: '年' }
      ],
      weeks: [
        { value: 1, label: '一' },
        { value: 2, label: '二' },
        { value: 3, label: '三' },
        { value: 4, label: '四' },
        { value: 5, label: '五' },
        { value: 6, label: '六' },
        { value: 7, label: '日' }
      ]
    }
  },

  computed: {
    ...mapState({
      currentTask: ({global}) => global.currentTask
    })
  },

  watch: {
    currentTask: {
      handler (newValue) {
        const { Pattern } = newValue.Recurrence
        if (Pattern) {
          this.level = Pattern.Type
          if (Pattern.Type === 'Weekly') {
            this.customWeek = Pattern.DaysOfWeek
            this.repeatNumber = Pattern.Interval
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-detail-repeat
  display flex
  flex-direction column
  align-items stretch
  .el-button
    margin 0 10px

.task-detail-repeat__header
  padding 15px
  display flex
  align-items center
  margin-bottom 10px
  font-size 14px

.task-detail-repeat__content
  margin 10px
  margin-top 0
  background $background-color
  border-radius 5px

.task-detail-repeat__row
  display flex
  align-items center
  min-height 40px
  padding 12px
  box-sizing border-box
  color $text
  font-size 14px
  cursor pointer
  user-select none
  .el-input
    width 55px
    margin-right 10px
</style>
