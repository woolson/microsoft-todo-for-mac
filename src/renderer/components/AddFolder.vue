<template lang="pug">
Model.add-task-folder(
  v-model="showTaskFolderAddModel"
  @cancel="updateState({showTaskFolderAddModel: false})"
)
  Header
    span {{operateType}}清单
    el-button(
      slot="right"
      type="success"
      @click="submit"
    ) 确认
  el-alert(
    title="可在输入框使用 Enter 确认提交"
    type="info"
    show-icon
    :closable="false"
  )
  div.add-task-folder__content
    div.form__main
      div.form__row
        label 名称
        el-input(
          ref="input"
          v-model="name"
          placeholder="清单名称"
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
    name: '测试清单'
  }),

  computed: {
    ...mapState({
      taskFolders: ({global}) => global.taskFolders,
      currentFolder: ({global}) => global.currentFolder,
      showTaskFolderAddModel: ({global}) => global.showTaskFolderAddModel
    }),
    operateType () {
      return this.currentFolder.Type ? '编辑' : '新建'
    }
  },

  watch: {
    showTaskFolderAddModel (newValue) {
      if (newValue) {
        this.$nextTick(this.$refs.input.focus)
        if (this.currentFolder.Type) {
          this.name = this.currentFolder.Name
        }
      }
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
            showTaskFolderAddModel: false
          })
        } else {
          const newFolder = await this.$post(`/me/taskfolders`, {Name: this.name})
          this.updateState({
            taskFolders: [...this.taskFolders, newFolder],
            showTaskFolderAddModel: false
          })
        }
        this.$message.success(`${this.operateType}成功`)
      } catch (err) {
        this.$message.error(`${this.operateType}失败`)
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
