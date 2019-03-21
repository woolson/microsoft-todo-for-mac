<template lang="pug">
div.task-detail-repeat
  div.task-detail-repeat__header.u-bb
    span.u-pointer(@click="$emit('update:step', 0)") 返回
  div.form__row-section
    div.form__row.u-bb
      label.u-mr20 重复
      el-select.u-flex-1(v-model="level")
        el-option(
          v-for="item in levelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        )
  div.form__row-section(v-show="level === 'Custom'")
    div.form__row.u-bb
      label.u-mr20 周期
      el-input(
        v-model="repeatNumber"
        type="number"
        :min="1"
      )
      el-select(v-model="repeatLevel")
        el-option(
          v-for="item in repeatLevelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        )
    div.form__row(v-show="repeatLevel === 'week'")
      el-checkbox-group.u-mlauto.u-mrauto(v-model="customWeek")
        el-checkbox-button(
          v-for="item in weeks"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        )
  el-button(
    type="primary"
    round
    @click="submit"
  ) 确定
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      level: 'Daily',
      repeatLevel: null,
      repeatNumber: null,
      customWeek: [],
      levelOptions: [
        { value: 'Daily', label: '每天' },
        { value: 'WeekDays', label: '工作日' },
        { value: 'Weekly', label: '每周' },
        { value: 'AbsoluteMonthly', label: '每月' },
        { value: 'AbsoluteYearly', label: '每年' },
        { value: 'Custom', label: '自定义' }
      ],
      repeatLevelOptions: [
        { value: 'day', label: '天' },
        { value: 'week', label: '周' },
        { value: 'month', label: '月' },
        { value: 'year', label: '年' }
      ],
      weeks: [
        { value: 'Monday', label: '一' },
        { value: 'Tuesday', label: '二' },
        { value: 'Wednesday', label: '三' },
        { value: 'Thursday', label: '四' },
        { value: 'Friday', label: '五' },
        { value: 'Saturday', label: '六' },
        { value: 'Sunday', label: '日' }
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
        const { Pattern } = newValue.Recurrence || {}
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
  },

  methods: {
    ...mapActions({
      updateTask: 'UPDATE_TASK'
    }),
    async submit () {
      await this.updateTask({
        Id: this.currentTask.Id,
        Recurrence: {
          Pattern: {
            Type: this.level
          }
        }
      })
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
