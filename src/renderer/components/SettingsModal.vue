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
        el-button.u-w80(round @click="syncData") {{$t('base.async')}}
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
          :value="showPlannedFolder"
          @change="updateState({showPlannedFolder: !showPlannedFolder})"
        )
      div.form__row
        label {{$t('task.showCompleted')}}
        el-switch(
          :active-color="$color.green"
          :inactive-color="$color.red"
          :value="showCompleteTask"
          @change="updateState({showCompleteTask: !showCompleteTask})"
        )
    div.form__row-section
      div.form__row.u-bb
        label {{$t('base.language')}}
        el-radio-group(
          v-model="currentLang"
          @change="languageChange"
          size="mini"
          :fill="$color.green"
        )
          el-radio-button(name="language" label="中")
          el-radio-button(name="language" label="EN")
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
  data () {
    return {
      currentLang: null
    }
  },

  computed: {
    ...mapState({
      language: ({global}) => global.language,
      showSettingsModal: ({global}) => global.showSettingsModal,
      showCompleteTask: ({global}) => global.showCompleteTask,
      showPlannedFolder: ({global}) => global.showPlannedFolder,
      showImportanceFolder: ({global}) => global.showImportanceFolder
    })
  },

  watch: {
    language: {
      handler (newValue) {
        this.currentLang = newValue === 'zh' ? '中' : 'EN'
      },
      immediate: true
    }
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
    },
    languageChange (value) {
      const lang = value === 'EN' ? 'en' : 'zh'
      this.$i18n.locale = lang
      this.updateState({language: lang})
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

