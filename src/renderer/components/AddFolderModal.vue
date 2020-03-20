<template lang="pug">
Modal.add-task-folder(
  v-model="showTaskFolderAddModal"
  @cancel="updateState({showTaskFolderAddModal: false})"
)
  Header
    span {{$t('folder.createFolder', [operateType])}}
    el-button(
      slot="right"
      @click="submit"
      circle
      icon="el-icon-check"
    )
  el-alert(
    :title="$t('message.enterToSubmit')"
    type="info"
    center
    :closable="false"
  )
  div.add-task-folder__content
    div.form__main
      div.u-form__row
        label {{$t('base.name')}}
        el-input.u-mt-5.u-mb-5(
          ref="input"
          v-model="name"
          :placeholder="$t('folder.name')"
          autofocus
          clearable
          @keyup.enter.native="submit"
        )
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'AddFolderModal',

  data: () => ({
    name: ''
  }),

  computed: {
    ...mapState([
      'taskFolders',
      'isCreateFolder',
      'showTaskFolderAddModal'
    ]),
    ...mapGetters([
      'currentFolder'
    ]),
    operateType () {
      return this.isCreateFolder ? this.$t('base.create') : this.$t('base.edit')
    }
  },

  watch: {
    showTaskFolderAddModal (newValue) {
      if (newValue) {
        this.$nextTick(this.$refs.input.focus)
        if (!this.isCreateFolder) {
          this.name = this.currentFolder.Name
        }
      } else {
        this.updateState({isCreateFolder: false})
        this.name = ''
      }
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    async submit () {
      const { Name, Id } = this.currentFolder
      if ((!this.isCreateFolder && Name === this.name) || !this.name) return
      const operateType = this.operateType
      try {
        if (!this.isCreateFolder) {
          await this.$patch(`/me/taskfolders/${Id}`, {Name: this.name})
          const folders = JSON.parse(JSON.stringify(this.taskFolders))
          const index = folders.findIndex(o => o.Id === Id)
          folders[index].Name = this.name
          this.updateState({
            taskFolders: folders,
            currentFolderId: folders[index].Id,
            showTaskFolderAddModal: false
          })
        } else {
          const newFolder = await this.$post(`/me/taskfolders`, {Name: this.name})
          this.updateState({
            taskFolders: [...this.taskFolders, newFolder],
            showTaskFolderAddModal: false,
            isCreateFolder: false
          })
        }
        this.$message.success(this.$t('message.commonSuccessfully', [operateType]))
      } catch (err) {
        this.$message.error(this.$t('message.commonFailed', [operateType]))
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

.add-task-folder__content
  flex 1
  padding 12px
  display flex
  flex-direction column
  align-items stretch
</style>
