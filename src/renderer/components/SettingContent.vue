<template lang="pug">
div
  Header
    span {{$t('base.setting')}}
  div.settings__content
    div.u-form__row-section
      div.u-form__row
        label {{$t('base.async')}}
        el-button.u-w100.u-mt-5.u-mb-5(
          size="mini"
          @click="syncData"
        ) {{$t('base.async')}}
      div.u-form__row.u-bb
        label {{$t('setting.showCalendar')}}
        el-switch.u-mt-5.u-mb-5(
          :value="showCalendarView"
          @change="updateState({showCalendarView: !showCalendarView})"
        )
    div.u-form__row-section
      div.u-form__row.u-bb
        label {{$t('task.showImportance')}}
        el-switch.u-mt-5.u-mb-5(
          :value="showImportanceFolder"
          @change="updateState({showImportanceFolder: !showImportanceFolder})"
        )
      div.u-form__row.u-bb
        label {{$t('task.showPlanned')}}
        el-switch.u-mt-5.u-mb-5(
          :value="showPlannedFolder"
          @change="updateState({showPlannedFolder: !showPlannedFolder})"
        )
    div.u-form__row-section
      div.u-form__row.u-bb
        label {{$t('base.language')}}
        el-radio-group.u-mt-5.u-mb-5(
          size="mini"
          v-model="currentLang"
          :fill="$color.blue"
          text-color="white"
          @change="languageChange"
        )
          el-radio-button(name="language" label="zh") 中
          el-radio-button(name="language" label="en") EN
      div.u-form__row.u-bb
        label {{$t('setting.selectTheme')}}
        el-radio-group(
          size="mini"
          v-model="currentTheme"
          :fill="$color.blue"
          text-color="white"
          @change="updateState({theme: $event})"
        )
          el-radio-button(name="theme" label="auto") {{$t('base.auto')}}
          el-radio-button(name="theme" label="light") {{$t('setting.lightTheme')}}
          el-radio-button(name="theme" label="dark") {{$t('setting.darkTheme')}}
    div.u-form__row-section
      div.u-form__row.u-bb
        label {{$t('base.alert')}}
        el-switch.u-mt-5.u-mb-5(
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
      currentTheme: null,
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
        this.currentLang = newValue
      },
      immediate: true
    },
    theme: {
      handler (newValue) {
        this.currentTheme = newValue
      },
      immediate: true
    },
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
      this.$i18n.locale = value
      this.updateState({language: value})
    },
    logout () {
      token.remove()
      this.updateState({
        showSettingsModal: false,
        shouldLogout: true
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
