<template lang="pug">
div.task-detail-main(
  v-loading.lock="loading"
  element-loading-background="rgba(0, 0, 0, 0.7)"
)
  Header.task-detail__header
    i.iconfont.u-mr10(
      slot="left"
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
      slot="right"
      :class="starClass"
      @click="changeTaskImportance"
    )
  el-alert(
    :title="$t('message.enterToSubmit')"
    type="info"
    center
    :closable="false"
  )
  div.form__row-section.u-mt12
    div.form__row.u-bb
      label {{$t('task.remindTime')}}
      div.u-center-end
        el-date-picker(
          ref="remindPicker"
          v-model="dateTime"
          type="datetime"
          format="MM-dd HH:mm"
          :placeholder="$t('base.select')"
          @change="remindSubmit"
        )
        i.iconfont.icon-right.u-ml5
    div.form__row
      label {{$t('task.dueTime')}}
      div.u-center-end
        el-date-picker(
          ref="stopPicker"
          v-model="stopDate"
          type="date"
          format="MM-dd"
          :placeholder="$t('base.select')"
          @change="stopDateSubmit"
        )
        i.iconfont.icon-right.u-ml5
    //- div.form__row(@click="$emit('update:step', 1)")
    //-   label 重复
    //-   i.iconfont.icon-right.u-ml5
  div.form__row-section
    div.form__row.u-bb(
      v-for="item,index in attachments"
      :key="item.Name"
    )
      label {{item.Name}}
      i.iconfont.icon-close.u-s14(
        @click="removeAttachment(item, index)"
      )
    div.form__row
      label {{$t('task.addFile')}}
      input.u-transparent.u-w0(
        ref="file"
        type="file"
        @change="selectFile"
      )
      el-button(@click="showSelect") {{$t('base.upload')}}
  div.form__row-section
    div.form__row
      textarea(
        v-model="note"
        :placeholder="$t('base.note')"
        @blur="noteSubmit"
        @keyup.enter="noteSubmit"
      )
  div.task-detail-main__bottom
    span {{taskDateInfo}}
    el-button(
      type="danger"
      @click="deleteTask"
      icon="el-icon-delete"
      round
    )
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { dater, fileToBase64 } from '@/common/utils'
import { ipcRenderer } from 'electron'

export default {
  data () {
    return {
      name: '',
      dateTime: '',
      stopDate: '',
      note: '',
      loading: false,
      attachments: []
    }
  },

  computed: {
    ...mapState([
      'tasks',
      'currentTask'
    ]),
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
      return this.dateTime ? dater(this.dateTime).format('MM-DD HH:mm') : this.$t('base.select')
    },
    stopDateText () {
      return this.stopDate ? dater(this.stopDate).format('MM-DD') : this.$t('base.select')
    },
    taskDateInfo () {
      const { CreatedDateTime, CompletedDateTime, Status } = this.currentTask
      if (Status === 'Completed') {
        return `${this.$t('task.completeAt')} ${dater(CompletedDateTime.DateTime).format('YYYY-MM-DD HH:mm:SS')}`
      } else {
        return `${this.$t('task.createAt')} ${dater(CreatedDateTime).format('YYYY-MM-DD HH:mm:SS')}`
      }
    }
  },

  watch: {
    currentTask: {
      handler (newValue) {
        const { ReminderDateTime, DueDateTime, Body, Subject, HasAttachments } = newValue
        if (ReminderDateTime) {
          this.dateTime = dater(ReminderDateTime.DateTime).format('x')
        } else this.dateTime = ''
        if (DueDateTime) {
          this.stopDate = dater(DueDateTime.DateTime).format('x')
        } else this.stopDate = ''

        this.name = Subject
        this.note = Body && Body.Content
        if (HasAttachments) this.fetchAttachments()
      },
      deep: true
    }
  },

  methods: {
    ...mapActions({
      updateTask: 'UPDATE_TASK',
      deleteTask: 'DELETE_TASK'
    }),
    ...mapMutations({
      updateState: 'UPDATE_STATE'
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
    async fetchAttachments () {
      const { value } = await this.$get(`/me/tasks/${this.currentTask.Id}/attachments`)
      this.attachments = value
    },
    async removeAttachment (item, index) {
      await this.$confirm(`${this.$t('message.confirmToDelete')} ${item.Name}`)
      await this.$fetch('DELETE', `/me/tasks/${this.currentTask.Id}/attachments/${item.Id}`)
      this.attachments.splice(index, 1)
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
    showSelect () {
      this.$refs.file.click()
    },
    async selectFile (evt) {
      console.dir(evt.target)
      const file = evt.target.files[0]
      const base64 = await fileToBase64(file)
      const result = await this.$post(`/me/tasks/${this.currentTask.Id}/attachments`, {
        '@odata.type': '#Microsoft.OutlookServices.FileAttachment',
        Name: file.name,
        ContentBytes: base64.split('base64,')[1]
      })
      this.attachments.push(result)
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
    },
    async delete () {
      try {
        const result = ipcRenderer.sendSync('delete-task', this.currentTask)
        if (result) {
          await this.deleteTask()
          this.$message.success(this.$t('message.deleteSuccessfully'))
        }
      } catch (err) {
        console.log(err)
        this.$message.error(this.$t('message.deleteFailed'))
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-detail-main
  height 100vh
  display flex
  flex-direction column

.task-detail__header
  padding 5px 15px
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

.el-input__prefix
  top -2px

.task-detail-main__bottom
  display flex
  padding 15px 12px
  margin-top auto
  align-items stretch
  justify-content space-between
  span
    flex 1
    margin-right 20px
    background $background-color
    line-height 32px
    border-radius 5px
    padding 0 15px
    color $text-gray
    user-select none
</style>
