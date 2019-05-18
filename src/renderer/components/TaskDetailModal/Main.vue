<template lang="pug">
div.task-detail-main
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
  div.u-form__row-section.u-mt12
    div.u-form__row.u-bb
      label {{$t('base.folder')}}
      div.u-center-end
        el-select.u-w210(
          v-model="parentId"
          @change="changeParent"
        )
          el-option(
            v-for="item in taskFolders"
            :key="item.Id"
            :value="item.Id"
            :label="item.Name"
          )
    div.u-form__row.u-bb
      label {{$t('task.remindTime')}}
      div.u-center-end
        el-date-picker(
          ref="remindPicker"
          v-model="dateTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          align="right"
          :placeholder="$t('base.select')"
          @change="remindSubmit"
        )
    div.u-form__row
      label {{$t('task.dueTime')}}
      div.u-center-end
        el-date-picker(
          ref="stopPicker"
          v-model="stopDate"
          type="date"
          align="right"
          format="yyyy-MM-dd"
          :placeholder="$t('base.select')"
          @change="stopDateSubmit"
        )
    //- div.u-form__row(@click="$emit('update:step', 1)")
    //-   label 重复
    //-   i.iconfont.icon-right.u-ml5
  div.u-form__row-section
    //- Choose upload file
    div.u-form__row
      label {{$t('task.addFile')}}
      input.u-transparent.u-w0(
        ref="file"
        type="file"
        @change="selectFile"
      )
      el-button(@click="showSelect") {{$t('base.upload')}}
    //- Attachment file list
    div.u-form__row.u-bb(
      v-for="item,index in attachments"
      :key="item.Name + index"
      @click="viewFile(item)"
    )
      label.u-underline.u-s12 {{item.Name}}
      i.iconfont.icon-close.u-s10.u-pointer(
        @click="removeAttachment(item, index)"
      )
  div.u-form__row-section
    //- Note
    div.u-form__row
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
      @click="onDelete"
      icon="el-icon-delete"
      round
    )
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { dater, fileToBase64 } from '@/common/utils'
import { ipcRenderer, remote } from 'electron'

export default {
  data () {
    return {
      loading: false,
      parentId: '',
      name: '',
      dateTime: '',
      stopDate: '',
      note: '',
      attachments: []
    }
  },

  computed: {
    ...mapState([
      'tasks',
      'currentTask',
      'taskFolders',
      'showTaskDetailModal'
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
      handler (newValue, oldValue) {
        if (newValue.Id === oldValue.Id) return
        const {
          Body,
          DueDateTime,
          HasAttachments,
          ParentFolderId,
          ReminderDateTime,
          Subject
        } = newValue
        if (ReminderDateTime) {
          this.dateTime = dater(ReminderDateTime.DateTime).format('x')
        } else this.dateTime = ''
        if (DueDateTime) {
          this.stopDate = dater(DueDateTime.DateTime).format('x')
        } else this.stopDate = ''

        this.parentId = ParentFolderId
        this.name = Subject
        this.note = Body && Body.Content
        // get task attachments
        if (HasAttachments && this.showTaskDetailModal) this.fetchAttachments()
        else this.attachments = []
      },
      deep: true
    },
    showTaskDetailModal (newValue) {
      if (this.currentTask.HasAttachments && newValue) {
        this.fetchAttachments()
      }
    }
  },

  mounted () {
    ipcRenderer.on('delete-task', () => this.onDelete())
  },

  methods: {
    ...mapActions({
      updateTask: 'UPDATE_TASK',
      deleteTask: 'DELETE_TASK'
    }),
    ...mapMutations({
      updateState: 'UPDATE_STATE',
      updateStateTask: 'UPDATE_TASK'
    }),
    changeParent (newParent) {
      this.updateTask({
        Id: this.currentTask.Id,
        ParentFolderId: newParent
      })
    },
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
      const { value } = await this.$get(
        `/me/tasks/${this.currentTask.Id}/attachments`,
        null,
        {showLoading: false}
      )
      this.attachments = value
    },
    async removeAttachment (item, index) {
      await this.$confirm(`${this.$t('message.confirmToDelete')} ${item.Name}`)
      await this.$fetch('DELETE', `/me/tasks/${this.currentTask.Id}/attachments/${item.Id}`)
      this.attachments.splice(index, 1)
      this.updateTaskAttachment()
    },
    async remindSubmit (value) {
      await this.updateTask({
        Id: this.currentTask.Id,
        IsReminderOn: !!value,
        ReminderDateTime: value ? {
          DateTime: value.toISOString(),
          TimeZone: 'Asia/Shanghai'
        } : null
      })
    },
    async stopDateSubmit (value) {
      await this.updateTask({
        Id: this.currentTask.Id,
        DueDateTime: value ? {
          DateTime: value.toISOString(),
          TimeZone: 'Asia/Shanghai'
        } : null
      })
    },
    showSelect () {
      this.$refs.file.click()
    },
    async selectFile (evt) {
      const file = evt.target.files[0]
      const base64 = await fileToBase64(file)
      const result = await this.$post(`/me/tasks/${this.currentTask.Id}/attachments`, {
        '@odata.type': '#Microsoft.OutlookServices.FileAttachment',
        Name: file.name,
        ContentBytes: base64.split('base64,')[1]
      })
      evt.target.value = ''
      this.attachments.push(result)
      this.updateTaskAttachment()
    },
    async noteSubmit () {
      const Body = this.currentTask.Body || {}
      if (this.note === Body.Content) return

      await this.updateTask({
        Id: this.currentTask.Id,
        Body: {
          ContentType: 'Text',
          Content: this.note
        }
      })
    },
    async subjectSubmit () {
      if (!this.name || this.name === this.currentTask.Subject) return
      await this.updateTask({
        Id: this.currentTask.Id,
        Subject: this.name
      })
    },
    async onDelete () {
      try {
        const result = await this.showNativeMessage(this.currentTask)
        if (!result) {
          await this.deleteTask()
          this.$message.success(this.$t('message.deleteSuccessfully'))
        }
      } catch (err) {
        console.log(err)
        this.$message.error(this.$t('message.deleteFailed'))
      }
    },
    showNativeMessage (arg) {
      return new Promise((resolve, reject) => {
        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
          type: 'question',
          icon: remote.nativeImage.createFromDataURL(require('@/assets/image/warning.png')),
          buttons: [this.$t('base.submit'), this.$t('base.cancel')],
          defaultId: 0,
          message: this.$t('base.notice'),
          detail: `${this.$t('message.confirmToDelete')} ${arg.Subject} ？`
        }, resolve)
      })
    },
    updateTaskAttachment () {
      const index = this.tasks.findIndex(o => o.Id === this.currentTask.Id)
      if (index !== -1) {
        this.updateStateTask(Object.assign({}, this.tasks[index], {HasAttachments: !!this.attachments.length}))
      }
    },
    viewFile (file) {
      console.log('viewFile')
      ipcRenderer.sendSync('view-file', file)
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-detail-main
  height 100vh
  display flex
  flex-direction column
  .el-date-editor.el-input
    width 210px

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
  color var(--text-main)
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
    background var(--background-section)
    line-height 32px
    border-radius 5px
    padding 0 15px
    color var(--text-sub)
    user-select none
</style>
