<template lang="pug">
div.calendar
  VueCal.vuecal--blue-theme(
    default-view="month"
    :locale="language === 'en' ? 'en' : 'zh-cn'"
    :disable-views="['years', 'week']"
    :events="events"
    events-on-month-view="short"
    :on-event-click="onEventClick"
  )
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/i18n/zh-cn.js'
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  components: { VueCal },

  computed: {
    ...mapState({
      allTasks: 'tasks',
      language: 'language'
    }),
    events () {
      const events = this.allTasks.filter(item => item.IsReminderOn)
      return events.map(item => {
        return {
          start: moment((item.ReminderDateTime || {}).DateTime).format('YYYY-MM-DD HH:mm:SS'),
          end: moment((item.ReminderDateTime || {}).DateTime).add(0.5, 'hours').format('YYYY-MM-DD HH:mm:SS'),
          title: item.Subject,
          data: item
        }
      })
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    onEventClick (event, e) {
      this.updateState({
        currentTask: event.data,
        showTaskDetailModal: true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.calendar
  flex 1
  >>> .vuecal__header
    -webkit-app-region drag
    background var(--task-background-active) !important
  >>> .vuecal__menu
  >>> .vuecal__title-bar
    background none !important
    button
    span
      color white !important
  >>> .vuecal__weekdays-headings
    background var(--background-section)
    color var(--text-main)
  >>> .vuecal__body
    color var(--text-main)
    background var(--background-content)
  >>> .vuecal__cell
    &.out-of-scope
      color var(--border)
    &:before
      border-color var(--border)
  >>> .vuecal__title-bar
    background rgba($blue, .3)
  >>> .vuecal__menu button
      height 2.5em
      transition none
  >>> .vuecal__time-column
    .vuecal__time-cell
      .line:before
        border-color var(--border)
  >>> .vuecal__event
    background-color rgba($blue, .7)
    border 1px solid $blue
    color #fff
  >>> .vuecal__bg
    &::-webkit-scrollbar
      width 3px !important
    &::-webkit-scrollbar-thumb
      background rgba(black, .25)
  >>> .vuecal--month-view .vuecal__cell-content
    justify-content flex-start
    height 100%
    align-items flex-end
  >>> .vuecal--month-view .vuecal__cell-date
    padding 4px
</style>

