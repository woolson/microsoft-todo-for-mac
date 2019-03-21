<template lang="pug">
Model.settings(
  v-model="showSettingsModel"
  @cancel="updateState({showSettingsModel: false})"
)
  Header
    span 设置
  div.settings__content
    div.form__row-section
      div.form__row
        label 同步数据
        el-button(round @click="syncData") 立即同步
    div.form__row-section
      div.form__row.u-bb
        label 显示重要清单
        el-switch(
          active-color="#3DC550"
          inactive-color="#FA6260"
          :value="showImportanceFolder"
          @change="updateState({showImportanceFolder: !showImportanceFolder})"
        )
      div.form__row.u-bb
        label 显示已计划日程
        el-switch(
          active-color="#3DC550"
          inactive-color="#FA6260"
          :value="showScheduleFolder"
          @change="updateState({showScheduleFolder: !showScheduleFolder})"
        )
      div.form__row
        label 显示已完成任务
        el-switch(
          active-color="#3DC550"
          inactive-color="#FA6260"
          :value="showCompleteTask"
          @change="updateState({showCompleteTask: !showCompleteTask})"
        )
    el-button.u-ml12.u-mr12.u-mtauto(
      round
      type="danger"
      @click="logout"
    ) 注销
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Storage } from '@/common/utils'

const token = new Storage('TOKEN')

export default {
  computed: {
    ...mapState({
      showSettingsModel: ({global}) => global.showSettingsModel,
      showCompleteTask: ({global}) => global.showCompleteTask,
      showScheduleFolder: ({global}) => global.showScheduleFolder,
      showImportanceFolder: ({global}) => global.showImportanceFolder
    })
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    ...mapActions({
      getTaskFolders: 'GET_TASK_FOLDERS',
      getTasks: 'GET_TASKS'
    }),
    async syncData () {
      this.updateState({showSettingsModel: false})
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.getTaskFolders()
      this.getTasks()
      loading.close()
    },
    logout () {
      token.remove()
      this.updateState({showSettingsModel: false, hasLogin: false})
    }
  }
}
</script>

<style lang="stylus" scoped>
.settings__content
  flex 1
  padding 12px 0
  display flex
  flex-direction column
  align-items stretch
</style>

