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
        el-button.u-w100(round @click="syncData") {{$t('base.async')}}
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
      div.form__row.u-bb
        label {{$t('setting.selectTheme')}}
        el-select.settings__theme(
          :value="theme"
          :collapse-tags="true"
          @change="updateState({theme: $event})"
        )
          el-option(:label="$t('base.auto')" value="auto")
          el-option(:label="$t('setting.lightTheme')" value="light")
          el-option(:label="$t('setting.darkTheme')" value="dark")
    el-button.u-ml12.u-mr12.u-mtauto(
      round
      type="danger"
      @click="logout"
    ) {{$t('base.logout')}}
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Storage } from '@/common/utils'

const token = new Storage('TOKEN')

export default {
  data () {
    return {
      currentLang: null,
      newVersion: false
    }
  },

  computed: {
    ...mapState([
      'theme',
      'language',
      'showSettingsModal',
      'showCompleteTask',
      'showPlannedFolder',
      'showImportanceFolder'
    ])
  },

  watch: {
    language: {
      handler (newValue) {
        this.currentLang = newValue === 'zh' ? '中' : 'EN'
      },
      immediate: true
    },
    theme (newValue) {
      if (newValue === 'auto') {
        const isDark = ipcRenderer.sendSync('get-theme')
        document.body.className = `theme-${isDark ? 'dark' : 'light'}`
      }
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
    languageChange (value) {
      const lang = value === 'EN' ? 'en' : 'zh'
      this.$i18n.locale = lang
      this.updateState({language: lang})
    },
    logout () {
      token.remove()
      this.updateState({
        showSettingsModal: false,
        shouldLogin: true
      })
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

.settings__theme
  width 80px
  >>> .el-input
  >>> .el-input__inner
    background transparent
    border none
    text-align right
</style>
