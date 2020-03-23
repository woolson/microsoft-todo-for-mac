<template lang="pug">
div.task-detail-main
  div.task-detail-main__content
    div.u-form__row-section.u-mt12
      div.u-form__row.u-bb
        label {{$t('base.name')}}
        el-input.u-mt-5.u-mb-5(
          v-model="name"
          clearable
          @blur="subjectSubmit"
        )
      div.u-form__row
        el-button.u-flex-1.u-mt-5.u-mb-5(
          size="small"
          @click="changeTaskStatus"
        )
          i.iconfont.u-s12.u-mr5(:class="checkClass")
          span {{$t(`base.${isCompleted ? '' : 'un'}completed`)}}
        el-button.u-flex-1.u-mt-5.u-mb-5(
          size="small"
          @click="changeTaskImportance"
        )
          i.iconfont.u-s12.u-mr5(:class="starClass")
          span {{$t(`base.${isImportance ? '' : 'un'}importance`)}}
    div.u-form__row-section.u-mt12
      div.u-form__row.u-bb
        label {{$t('base.folder')}}
        div.u-center-end
          el-select.u-w180.u-mt-5.u-mb-5(
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
          el-date-picker.u-w180.u-mt-5.u-mb-5(
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
          el-date-picker.u-w180.u-mt-5.u-mb-5(
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
      //- Note
      div.u-form__row.start
        label {{$t('base.note')}}
        el-input(
          type="textarea"
          v-model="note"
          @blur="noteSubmit"
          rows="3"
        )
    div.u-form__row-section
      //- Choose upload file
      div.u-form__row
        label
          span {{$t('base.attachment')}}
          i.el-icon-loading.u-ml5(v-if="isLoading")
          i.el-icon-refresh.u-ml5.u-pointer(
            v-else
            :title="$t('base.update')"
            @click="fetchAttachments"
          )
        input.u-transparent.u-w0(
          ref="file"
          type="file"
          @change="selectFile"
        )
        el-button.u-mt-5.u-mb-5(
          @click="showSelect"
        ) {{$t('base.upload')}}
      //- Attachment file list
      div.u-form__row.u-bb(
        v-for="item,index in attachments"
        :key="item.Name + index"
      )
        label.u-underline.u-s12.u-pointer(
          @click="viewFile(item)"
        ) {{item.Name}}
        i.el-icon-download.u-mlauto.u-mr15.u-s16.u-pointer(
          @click="downloadAttachment(item)"
        )
        i.el-icon-close.u-s16.u-pointer(
          @click="removeAttachment(item, index)"
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
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { dater, fileToBase64 } from '~/share/utils'
import { ipcRenderer, remote } from 'electron'
import { showNativeMessage } from '@/common/utils'
import axios from 'axios'

export default {
  data () {
    return {
      loading: false,
      parentId: '',
      name: '',
      dateTime: '',
      stopDate: '',
      note: '',
      isLoading: false,
      cancel: null
    }
  },

  computed: {
    ...mapState([
      'tasks',
      'taskFolders',
      'currentTaskId',
      'showTaskDetailModal'
    ]),
    ...mapGetters([
      'currentTask'
    ]),
    isCompleted () {
      return this.currentTask.Status === 'Completed'
    },
    isImportance () {
      return this.currentTask.Importance === 'High'
    },
    attachments () {
      return this.currentTask.Attachments || []
    },
    titleStyle () {
      return {
        textDecoration: this.isCompleted ? 'line-through' : 'none',
        color: this.isCompleted ? '#AAAAAA' : ''
      }
    },
    checkClass () {
      return this.isCompleted ? 'icon-check' : 'icon-check-o'
    },
    starClass () {
      return this.isImportance ? 'icon-star' : 'icon-star-o'
    },
    remindDateText () {
      return this.dateTime
        ? dater(this.dateTime).format('MM-DD HH:mm')
        : this.$t('base.select')
    },
    stopDateText () {
      return this.stopDate
        ? dater(this.stopDate).format('MM-DD')
        : this.$t('base.select')
    },
    taskDateInfo () {
      const { CreatedDateTime, CompletedDateTime } = this.currentTask
      if (this.isCompleted) {
        return `${this.$t('task.completeAt')} ${dater(CompletedDateTime.DateTime).format('YYYY-MM-DD HH:mm:SS')}`
      } else {
        return `${this.$t('task.createAt')} ${dater(CreatedDateTime).format('YYYY-MM-DD HH:mm:SS')}`
      }
    }
  },

  watch: {
    currentTaskId () {
      const {
        Body,
        DueDateTime,
        HasAttachments,
        ParentFolderId,
        ReminderDateTime,
        Subject
      } = this.currentTask
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
      if (HasAttachments && this.showTaskDetailModal && this.attachments.length === 0) {
        setTimeout(() => {
          this.fetchAttachments()
        }, 200)
      } else {
        this.cancel && this.cancel()
        this.isLoading = false
      }
    }
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
        Status: this.isCompleted ? 'NotStarted' : 'Completed'
      })
    },
    changeTaskImportance () {
      this.updateTask({
        Id: this.currentTask.Id,
        Importance: this.isImportance ? 'Normal' : 'High'
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
      const taskId = this.currentTask.Id
      if (this.isLoading) {
        if (this.cancel) {
          this.cancel()
          this.isLoading = false
        }
      } else {
        this.isLoading = true
      }
      const { value } = await this.$get(
        `/me/tasks/${taskId}/attachments`,
        null,
        {
          showLoading: false,
          cancelToken: new axios.CancelToken(c => {
            this.cancel = c
          })
        }
      )

      this.updateStateTask({
        Id: taskId,
        Attachments: value
      })
      this.isLoading = false
    },
    async removeAttachment (item, index) {
      try {
        const message = `${this.$t('message.confirmToDelete')} ${item.Name}`
        const { response } = await showNativeMessage(message)
        if (!response) {
          await this.$fetch('DELETE', `/me/tasks/${this.currentTask.Id}/attachments/${item.Id}`)
          const newAttachment = [...this.attachments]
          newAttachment.splice(index, 1)
          this.updateStateTask({
            Id: this.currentTask.Id,
            Attachments: newAttachment,
            HasAttachments: !!newAttachment.length
          })
          // this.updateTaskAttachment()
        }
      } catch (err) {
        this.$message.error(this.$t('message.deleteFailed'))
      }
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
      this.updateStateTask({
        Id: this.currentTask.Id,
        Attachments: [...this.attachments, result],
        HasAttachments: true
      })
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
        const message = `${this.$t('message.confirmToDelete')} ${this.currentTask.Subject} ？`
        const { response } = await showNativeMessage(message)

        if (!response) {
          await this.deleteTask()
          this.$message.success(this.$t('message.deleteSuccessfully'))
        }
      } catch (err) {
        console.log(err)
        this.$message.error(this.$t('message.deleteFailed'))
      }
    },
    updateTaskAttachment () {
      const index = this.tasks.findIndex(o => o.Id === this.currentTask.Id)
      if (index !== -1) {
        this.updateStateTask({
          ...this.tasks[index],
          HasAttachments: !!this.attachments.length
        })
      }
    },
    async downloadAttachment (file) {
      const res = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        defaultPath: file.Name
      })
      if (res.filePath) {
        ipcRenderer.sendSync('save-file', {file, filename: res.filePath})
        this.$message.success('成功')
      }
    },
    viewFile (file) {
      // console.log('viewFile')
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
  .el-alert
    flex-shrink 0
  .icon-star
    color $yellow
  .icon-check
    color $green

.task-detail__header
  padding 5px 15px
  display flex
  align-items center
  box-shadow 0 0 5px rgba(black, .1)
  flex-shrink 0
  h1
    flex 1
    $size-text-large
    font-weight normal
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    margin 0
  i
    font-size 20px
    cursor pointer
    color var(--text-main)
    &.icon-check
      color $green
    &.icon-star
      color $yellow

>>> textarea
  font-size $size-text-medium
  color var(--text-main)
  background var(--background)
  &:not(:focus)
    border-color transparent

.el-input__prefix
  top -2px

.task-detail-main__content
  flex 1
  overflow auto
  &::-webkit-scrollbar
    width 3px !important
  &::-webkit-scrollbar-thumb
    background rgba(black, .25)

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
