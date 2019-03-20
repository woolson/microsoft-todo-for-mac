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
    div.form__main
      div.form__row
        label 名称
        el-input(
          ref="input"
          v-model="name"
          placeholder="任务名称"
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
    ...mapState({
      showTaskAddModel: ({global}) => global.showTaskAddModel
    })
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
  padding 12px
  display flex
  flex-direction column
  align-items stretch
</style>
