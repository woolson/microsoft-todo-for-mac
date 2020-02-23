<template lang="pug">
div
  Header
    span {{$t('base.setting')}}
  div.settings__content
    div.u-form__row-section
      div.u-form__row
        label {{$t('base.async')}}
        el-button.u-w100.u-mt-5.u-mb-5(
          round
          @click="syncData"
        ) {{$t('base.async')}}
      div.u-form__row.u-bb
        label {{$t('setting.showCalendar')}}
        el-switch(
          :value="showCalendarView"
          @change="updateState({showCalendarView: !showCalendarView})"
        )
    div.u-form__row-section
      div.u-form__row.u-bb
        label {{$t('task.showImportance')}}
        el-switch(
          :value="showImportanceFolder"
          @change="updateState({showImportanceFolder: !showImportanceFolder})"
        )
      div.u-form__row.u-bb
        label {{$t('task.showPlanned')}}
        el-switch(
          :value="showPlannedFolder"
          @change="updateState({showPlannedFolder: !showPlannedFolder})"
        )
    div.u-form__row-section
      div.u-form__row.u-bb
        label {{$t('base.language')}}
        el-radio-group(
          v-model="currentLang"
          @change="languageChange"
          :fill="$color.blue"
          text-color="white"
        )
          el-radio-button(name="language" label="中")
          el-radio-button(name="language" label="EN")
      div.u-form__row.u-bb
        label {{$t('setting.selectTheme')}}
        el-select.settings__theme(
          :value="theme"
          :collapse-tags="true"
          @change="updateState({theme: $event})"
        )
          el-option(:label="$t('base.auto')" value="auto")
          el-option(:label="$t('setting.lightTheme')" value="light")
          el-option(:label="$t('setting.darkTheme')" value="dark")
    div.u-form__row-section
      div.u-form__row.u-bb
        label {{$t('base.alert')}}
        el-switch(
          :value="playAlertVoice"
          @change="updateState({playAlertVoice: !playAlertVoice})"
        )
      div.u-form__row.u-bb(v-show="playAlertVoice")
        label {{$t('base.volume')}}
        el-slider.u-w120.u-mr12.u-mt-10.u-mb-10(
          v-model="volume"
          :min="10"
          :step="10"
        )
    el-button.u-ml12.u-mr12.u-mtauto(
      round
      type="danger"
      @click="logout"
    ) {{$t('base.logout')}}
</template>

<script>
// import { ipcRenderer } from 'electron'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Storage } from '~/share/utils'
import { playCompleteVoice } from '@/common/utils'

const token = new Storage('TOKEN')

export default {
  data () {
    return {
      volume: this.alertVoicevolume,
      currentLang: null,
      newVersion: false
    }
  },

  computed: {
    ...mapState([
      'theme',
      'language',
      'playAlertVoice',
      'alertVoicevolume',
      'showSettingsModal',
      'showCalendarView',
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
    // theme (newValue) {
    //   if (newValue === 'auto') {
    //     document.documentElement.removeAttribute('data-theme')
    //   } else {
    //     const isDark = ipcRenderer.sendSync('get-theme')
    //     document.documentElement.setAttribute('data-theme', `theme-${isDark ? 'dark' : 'light'}`)
    //   }
    // },
    volume (newValue, oldValue) {
      oldValue && playCompleteVoice(newValue)
      this.updateState({alertVoicevolume: newValue})
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
        shouldLogin: true,
        tasks: [],
        taskFolders: []
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
  margin -5px 0
  >>> .el-input
  >>> .el-input__inner
    background transparent
    border none
    text-align right

.settings
  >>> .el-slider__runway
    margin 5px 0
</style>
