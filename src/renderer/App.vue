<template lang="pug">
div#app
  WebView(v-if="!hasLogin")
  Sidebar
  TaskList
  TaskDetailModal
  AddFolderModal
  AddTaskModal
  SettingsModal
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import initShortCut from './common/event'
import WebView from '@/components/WebView'
import Sidebar from '@/components/Sidebar'
import TaskList from '@/components/TaskList/'
import TaskDetailModal from '@/components/TaskDetailModal'
import AddFolderModal from '@/components/AddFolderModal'
import AddTaskModal from '@/components/AddTaskModal'
import SettingsModal from '@/components/SettingsModal'
import { ipcRenderer } from 'electron'

export default {
  name: 'ms-todo',

  components: {
    WebView,
    Sidebar,
    TaskList,
    TaskDetailModal,
    AddFolderModal,
    AddTaskModal,
    SettingsModal
  },

  computed: {
    ...mapState([
      'token',
      'theme',
      'language',
      'hasLogin',
      'currentTask',
      'currentFolder',
      'showCompleteTask',
      'showPlannedFolder',
      'showImportanceFolder'
    ])
  },

  mounted () {
    this.init()
    initShortCut()
    // Update data when window focus
    // window.onfocus = () => {
    //   this.init(false)
    // }
    // Update data every 30 minute
    // setInterval(() => {
    //   this.init(false)
    // }, 1000 * 60 * 30)
  },

  watch: {
    currentTask: {
      handler (newValue) {
        ipcRenderer.send('update-touchbar', {
          ...this.currentTask,
          showCompleteTask: this.showCompleteTask
        })
      },
      deep: true
    },
    currentFolder: {
      handler (newValue) {
        this.updateState({currentTask: {}})
      },
      deep: true
    },
    theme: {
      handler (newValue) {
        document.body.className = `theme-${newValue}`
        ipcRenderer.sendSync('update-setting', {theme: newValue})
      },
      immediate: true
    },
    language (newValue) {
      ipcRenderer.sendSync('update-setting', {language: newValue})
    },
    showCompleteTask (newValue) {
      ipcRenderer.sendSync('update-setting', {showCompleteTask: newValue})
    },
    showPlannedFolder (newValue) {
      ipcRenderer.sendSync('update-setting', {showPlannedFolder: newValue})
    },
    showImportanceFolder (newValue) {
      ipcRenderer.sendSync('update-setting', {showImportanceFolder: newValue})
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    ...mapActions({
      getUserPhoto: 'GET_USER_PHOTO',
      getTaskFolders: 'GET_TASK_FOLDERS',
      getTasks: 'GET_TASKS',
      updateTask: 'UPDATE_TASK'
    }),
    async init (showLoading) {
      let loading
      if (showLoading !== false) {
        loading = this.$loading({
          lock: true,
          text: this.$t('base.loading'),
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      try {
        await this.getTaskFolders()
        await this.getTasks()
      } finally {
        loading && loading.close()
      }
    }
  }
}
</script>

<style lang="stylus">
@import "./style/theme-dark.styl"

html
body
  *
    font-family Segoe UI,SegoeUI,Segoe WP,Helvetica Neue,Helvetica,Tahoma,Arial,sans-serif

#app
  width 100vw
  height 100vh
  display flex
</style>
