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
        label 同步
        el-button(@click="getTaskFolders") 立即同步
    div.form__row-section
      div.form__row.u-bb
        label 显示重要
        el-switch(
          active-color="#3DC550"
          inactive-color="#FA6260"
          :value="showImportanceFolder"
          @change="updateState({showImportanceFolder: !showImportanceFolder})"
        )
      div.form__row
        label 显示完成
        el-switch(
          active-color="#3DC550"
          inactive-color="#FA6260"
          :value="showCompleteTask"
          @change="updateState({showCompleteTask: !showCompleteTask})"
        )
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      showSettingsModel: ({global}) => global.showSettingsModel,
      showCompleteTask: ({global}) => global.showCompleteTask,
      showImportanceFolder: ({global}) => global.showImportanceFolder
    })
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    ...mapActions({
      getTaskFolders: 'GET_TASK_FOLDERS'
    })
  }
}
</script>

<style lang="stylus" scoped>
.settings__content
  padding 12px 0
</style>

