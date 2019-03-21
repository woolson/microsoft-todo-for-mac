<template lang="pug">
Model.add-task(
  v-model="showTaskAddModel"
  @cancel="updateState({showTaskAddModel: false})"
)
  Header
    span 添加任务
    el-button(
      slot="right"
      type="success"
      @click="submit"
    ) 确认
  div.add-task__content
    div.form__row-section
      div.form__row
        label 所属清单
        el-select.u-flex-1(v-model="belongFolder")
          el-option(
            v-for="item in taskFolders"
            :key="item.Id"
            :value="item.Id"
            :label="item.Name"
          )
    div.form__row-section
      div.form__row
        label 名称
        el-input(
          ref="input"
          v-model="name"
          placeholder="任务名称"
          autofocus
        )
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AddFolder',

  data: () => ({
    name: '',
    belongFolder: null
  }),

  computed: {
    ...mapState({
      taskFolders: ({global}) => global.taskFolders,
      currentFolder: ({global}) => global.currentFolder,
      showTaskAddModel: ({global}) => global.showTaskAddModel
    })
  },

  watch: {
    showTaskAddModel (newValue) {
      if (!newValue) return
      this.belongFolder = this.currentFolder.Id
      this.$nextTick(this.$refs.input.focus)
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    async submit () {
      try {
        const newFolder = await this.$post(`/me/taskfolders`, {Name: this.name})
        this.updateState({taskFolders: [...this.taskFolders, newFolder]})
        this.$message.success('添加成功')
      } catch (err) {
        this.$message.error('添加失败')
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
</style>
