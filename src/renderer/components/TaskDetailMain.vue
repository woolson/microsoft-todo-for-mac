<template lang="pug">
div.task-detail-main(
  v-loading.lock="loading"
)
  div.task-detail__header
    i.iconfont.u-mr10(
      :class="checkClass"
      @click="changeTaskStatus"
    )
    el-input(
      v-model="name"
      clearable
      @blur="subjectSubmit"
      @keyup.enter.native="subjectSubmit"
    )
    i.iconfont.u-ml10(
      :class="starClass"
      @click="changeTaskImportance"
    )
  el-alert(
    title="可在输入框使用 Enter 确认提交"
    type="info"
    show-icon
    :closable="false"
  )
  div.form__row-section.u-mt12
    div.form__row.u-bb
      label 提醒时间
      div.content(@click.stop="showRemindPicker")
        el-date-picker(
          ref="remindPicker"
          v-model="dateTime"
          type="datetime"
          @change="remindSubmit"
        )
        span {{remindDateText}}
        i.iconfont.icon-right.u-ml5
    div.form__row
      label 截止日期
      div.content(@click.stop="showStopPicker")
        el-date-picker(
          ref="stopPicker"
          v-model="stopDate"
          type="date"
          @change="stopDateSubmit"
        )
        span {{stopDateText}}
        i.iconfont.icon-right.u-ml5
    //- div.form__row(@click="$emit('update:step', 1)")
    //-   label 重复
    //-   i.iconfont.icon-right.u-ml5
  div.form__row-section
    div.form__row(@click="selectFile")
      label 添加文件
      input.u-transparent(type="file" ref="file" )
  div.form__row-section
    div.form__row
      textarea(
        v-model="note"
        placeholder="添加备注"
        @blur="noteSubmit"
        @keyup.enter="noteSubmit"
      )
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { dater } from '@/common/utils'

export default {
  data () {
    return {
      name: '',
      dateTime: '',
      stopDate: '',
      note: '',
      loading: false
    }
  },

  computed: {
    ...mapState({
      currentTask: ({global}) => global.currentTask
    }),
    titleStyle () {
      const { Status } = this.currentTask
      return {
        textDecoration: Status === 'Completed' ? 'line-through' : 'none',
        color: Status === 'Completed' ? '#AAAAAA' : ''
      }
    },
    checkClass () {
      return this.currentTask.Status === 'Completed' ? 'icon-check' : 'icon-check-o'
    },
    starClass () {
      return this.currentTask.Importance === 'High' ? 'icon-star' : 'icon-star-o'
    },
    remindDateText () {
      return this.dateTime ? dater(this.dateTime).format('MM月DD日 HH点mm分 提醒我') : '选择'
    },
    stopDateText () {
      return this.stopDate ? dater(this.stopDate).format('MM月DD日 到期') : '选择'
    }
  },

  watch: {
    currentTask: {
      handler (newValue) {
        const { ReminderDateTime, DueDateTime, IsReminderOn, Body, Subject } = newValue
        if (ReminderDateTime && IsReminderOn) {
          this.dateTime = dater(ReminderDateTime.DateTime).format('x')
        } else this.dateTime = ''
        if (DueDateTime) {
          this.stopDate = dater(DueDateTime.DateTime).format('x')
        } else this.stopDate = ''

        this.name = Subject
        this.note = Body && Body.Content
      },
      deep: true
    }
  },

  methods: {
    ...mapActions({
      updateTask: 'UPDATE_TASK'
    }),
    changeTaskStatus () {
      this.updateTask({
        Id: this.currentTask.Id,
        Status: this.currentTask.Status === 'Completed' ? 'NotStarted' : 'Completed'
      })
    },
    changeTaskImportance () {
      this.updateTask({
        Id: this.currentTask.Id,
        Importance: this.currentTask.Importance === 'High' ? 'Normal' : 'High'
      })
    },
    showRemindPicker () {
      const { showPicker, hidePicker, pickerVisible } = this.$refs.remindPicker
      if (pickerVisible) hidePicker()
      else showPicker()
    },
    showStopPicker () {
      const { showPicker, hidePicker, pickerVisible } = this.$refs.stopPicker
      if (pickerVisible) hidePicker()
      else showPicker()
    },
    async remindSubmit (value) {
      this.loading = true
      await this.updateTask({
        Id: this.currentTask.Id,
        IsReminderOn: true,
        ReminderDateTime: {
          DateTime: value.toISOString(),
          TimeZone: 'Asia/Shanghai'
        }
      })
      this.loading = false
    },
    async stopDateSubmit (value) {
      this.loading = true
      await this.updateTask({
        Id: this.currentTask.Id,
        DueDateTime: {
          DateTime: value.toISOString(),
          TimeZone: 'Asia/Shanghai'
        }
      })
      this.loading = false
    },
    selectFile () {
      this.$refs.file.click()
    },
    async noteSubmit () {
      const Body = this.currentTask.Body || {}
      if (this.note === Body.Content) return

      this.loading = true
      await this.updateTask({
        Id: this.currentTask.Id,
        Body: {
          ContentType: 'Text',
          Content: this.note
        }
      })
      this.loading = false
    },
    async subjectSubmit () {
      if (!this.name || this.name === this.currentTask.Subject) return
      this.loading = true
      await this.updateTask({
        Id: this.currentTask.Id,
        Subject: this.name
      })
      this.loading = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-detail__header
  padding 15px
  display flex
  align-items center
  box-shadow 0 0 5px rgba(black, .1)
  h1
    flex 1
    font-size 16px
    font-weight normal
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    margin 0
  i
    font-size 20px
    cursor pointer
    &.icon-check
      color $green
    &.icon-star
      color $yellow

textarea
  width 100%
  height 60px
  border none
  resize none
  outline none
  font-size 14px
  color $text
  background transparent

.el-date-editor
  width 0px
  // height 0px
  opacity 0
  >>> input
    padding 0
    width 0 !important
    height 0 !important
</style>
