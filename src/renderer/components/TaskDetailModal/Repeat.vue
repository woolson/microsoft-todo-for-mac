<template lang="pug">
div.task-detail-repeat
  div.task-detail-repeat__header.u-bb
    span.u-pointer(@click="$emit('update:step', 0)") {{$t('base.cancel')}}
  div.form__row-section
    div.form__row.u-bb
      label.u-mr20 {{$t('base.repeat')}}
      el-select.u-flex-1(v-model="level")
        el-option(
          v-for="item in levelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        )
  div.form__row-section(v-show="level === 'Custom'")
    div.form__row.u-bb
      label.u-mr20 {{$t('base.period')}}
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
  ) {{$t('base.submit')}}
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
        { value: 'Daily', label: this.$t('base.daily') },
        { value: 'WeekDays', label: this.$t('base.weekDays') },
        { value: 'Weekly', label: this.$t('base.weekly') },
        { value: 'AbsoluteMonthly', label: this.$t('base.monthly') },
        { value: 'AbsoluteYearly', label: this.$t('base.yearly') },
        { value: 'Custom', label: this.$t('base.custom') }
      ],
      repeatLevelOptions: [
        { value: 'day', label: this.$t('base.day') },
        { value: 'week', label: this.$t('base.week') },
        { value: 'month', label: this.$t('base.month') },
        { value: 'year', label: this.$t('base.year') }
      ],
      weeks: [
        { value: 'Monday', label: this.$t('base.monday') },
        { value: 'Tuesday', label: this.$t('base.tuesday') },
        { value: 'Wednesday', label: this.$t('base.wednesday') },
        { value: 'Thursday', label: this.$t('base.thurday') },
        { value: 'Friday', label: this.$t('base.firday') },
        { value: 'Saturday', label: this.$t('base.saturday') },
        { value: 'Sunday', label: this.$t('base.sunday') }
      ]
    }
  },

  computed: {
    ...mapState([
      'currentTask'
    ])
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
