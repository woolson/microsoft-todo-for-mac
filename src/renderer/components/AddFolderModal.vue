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
        el-input(
          ref="input"
          v-model="name"
          :placeholder="$t('folder.name')"
          autofocus
          clearable
          @keyup.enter.native="submit"
        )
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AddFolder',

  data: () => ({
    name: ''
  }),

  computed: {
    ...mapState([
      'taskFolders',
      'currentFolder',
      'showTaskFolderAddModal'
    ]),
    operateType () {
      return this.currentFolder.Type ? this.$t('base.edit') : this.$t('base.create')
    }
  },

  watch: {
    showTaskFolderAddModal (newValue) {
      if (newValue) {
        this.$nextTick(this.$refs.input.focus)
        if (this.currentFolder.Type) {
          this.name = this.currentFolder.Name
        }
      } else this.name = ''
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    async submit () {
      const { Type, Name, Id } = this.currentFolder
      if ((Type && Name === this.name) || !this.name) return
      try {
        if (Type) {
          await this.$patch(`/me/taskfolders/${Id}`, {Name: this.name})
          const folders = JSON.parse(JSON.stringify(this.taskFolders))
          const index = folders.findIndex(o => o.Id === Id)
          folders[index].Name = this.name
          this.updateState({
            taskFolders: folders,
            currentFolder: folders[index],
            showTaskFolderAddModal: false
          })
        } else {
          const newFolder = await this.$post(`/me/taskfolders`, {Name: this.name})
          this.updateState({
            taskFolders: [...this.taskFolders, newFolder],
            showTaskFolderAddModal: false
          })
        }
        this.$message.success(this.$t('message.commonSuccessfully', [this.operateType]))
      } catch (err) {
        this.$message.error(this.$t('message.commonFailed', [this.operateType]))
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
