<template lang="pug">
Modal.settings(
  v-model="showSettingsModal"
  @cancel="updateState({showSettingsModal: false})"
)
  Header
    span {{$t('base.setting')}}
  div.settings__content
    div.form__row-section
      div.form__row
        label {{$t('base.async')}}
        el-button(round @click="syncData") {{$t('base.async')}}
    div.form__row-section
      div.form__row.u-bb
        label {{$t('task.showImportance')}}
        el-switch(
          :active-color="$color.green"
          :inactive-color="$color.red"
          :value="showImportanceFolder"
          @change="updateState({showImportanceFolder: !showImportanceFolder})"
        )
      div.form__row.u-bb
        label {{$t('task.showPlanned')}}
        el-switch(
          :active-color="$color.green"
          :inactive-color="$color.red"
          :value="showScheduleFolder"
          @change="updateState({showScheduleFolder: !showScheduleFolder})"
        )
      div.form__row
        label {{$t('task.showCompleted')}}
        el-switch(
          :active-color="$color.green"
          :inactive-color="$color.red"
          :value="showCompleteTask"
          @change="updateState({showCompleteTask: !showCompleteTask})"
        )
    el-button.u-ml12.u-mr12.u-mtauto(
      round
      type="danger"
      @click="logout"
    ) {{$t('base.logout')}}
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Storage } from '@/common/utils'

const token = new Storage('TOKEN')

export default {
  computed: {
    ...mapState({
      showSettingsModal: ({global}) => global.showSettingsModal,
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
      this.updateState({showSettingsModal: false})
      const loading = this.$loading({
        lock: true,
        text: this.$t('base.loading'),
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.getTaskFolders()
      this.getTasks()
      loading.close()
    },
    logout () {
      token.remove()
      this.updateState({showSettingsModal: false, hasLogin: false})
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

