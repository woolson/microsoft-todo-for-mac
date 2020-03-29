<template lang="pug">
Modal.add-task(
  v-model="showTaskAddModal"
  @cancel="updateState({showTaskAddModal: false})"
)
  Header
    span {{$t('task.create')}}
    el-button(
      slot="right"
      @click="submit"
      circle
      icon="el-icon-check"
    )
  div.add-task__content
    div.u-form__row-section
      div.u-form__row
        label.u-w50 {{$t('base.folder')}}
        el-select.u-flex-1.u-mt-5.u-mb-5(v-model="belongFolder")
          el-option(
            v-for="item in taskFolders"
            :key="item.Id"
            :value="item.Id"
            :label="item.Name"
          )
      div.u-form__row
        label.u-w50 {{$t('base.name')}}
        el-input.u-mt-5.u-mb-5(
          ref="input"
          v-model="name"
          :placeholder="$t('task.name')"
          @keyup.enter.meta.native.stop="submit"
          clearable
          autofocus
        )
      //- Note
      div.u-form__row.start
        label.u-w50 {{$t('base.note')}}
        el-input(
          type="textarea"
          v-model="note"
          :placeholder="$t('base.note')"
          rows="3"
          clearable
        )
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'AddTaskModel',

  data: () => ({
    name: '',
    belongFolder: null,
    note: ''
  }),

  computed: {
    ...mapState([
      'tasks',
      'taskFolders',
      'showTaskAddModal',
      'clipboard',
      'clipboardAs',
      'showClipboardTip'
    ]),
    ...mapGetters([
      'currentFolder'
    ])
  },

  watch: {
    showTaskAddModal (newValue) {
      if (!newValue) {
        this.name = ''
        this.note = ''
        return
      }
      if (this.currentFolder.Id.length > 20) {
        this.belongFolder = this.currentFolder.Id
      } else {
        const hasIdFolder = this.taskFolders.find(o => o.Id.length > 20)
        if (hasIdFolder) this.belongFolder = hasIdFolder.Id
      }
      if (this.clipboard && this.clipboardAs) {
        this[this.clipboardAs] = this.clipboard
        this.updateState({
          clipboard: '',
          clipboardAs: '',
          showClipboardTip: false
        })
      }
      this.$nextTick(this.$refs.input.focus)
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    async submit () {
      try {
        const newTask = await this.$post(`/me/taskfolders/${this.belongFolder}/tasks`, {
          Subject: this.name,
          Body: {
            ContentType: 'Text',
            Content: this.note
          }
        })
        this.updateState({
          tasks: [...this.tasks, newTask],
          showTaskAddModal: false
        })
        this.$message.success(this.$t('message.createSuccessfully'))
      } catch (err) {
        this.$message.error(this.$t('message.createFailed'))
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.model__main
  display flex
  flex-direction column
  height 100vh

.add-task__content
  flex 1
  padding 12px 0
  display flex
  flex-direction column
  align-items stretch

>>> textarea
  font-size $size-text-medium
  color var(--text-main)
  background var(--background)
  &:not(:focus)
    border-color transparent
</style>
