<template lang="pug">
div#app
  //- App views
  Tabbar(v-if="showCalendarView")
  KeepAlive
    RouterView
  //- Modals
  LoginModal
  LogoutModal
  TaskDetailModal
  AddFolderModal
  AddTaskModal
  SettingsModal
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import initShortCut from './common/event'
import Notification from './common/notification'
import LoginModal from '@/components/LoginModal'
import LogoutModal from '@/components/LogoutModal'
import Tabbar from '@/components/Tabbar'
import TaskList from '@/components/TaskList/'
import TaskDetailModal from '@/components/TaskDetailModal'
import AddFolderModal from '@/components/AddFolderModal'
import AddTaskModal from '@/components/AddTaskModal'
import SettingsModal from '@/components/SettingsModal'
import { ipcRenderer } from 'electron'
import { changeTheme } from '@/common/utils'

const notify = new Notification()

export default {
  name: 'ms-todo',

  components: {
    Tabbar,
    TaskList,
    LoginModal,
    LogoutModal,
    TaskDetailModal,
    AddFolderModal,
    AddTaskModal,
    SettingsModal
  },

  computed: {
    ...mapState([
      'token',
      'theme',
      'tasks',
      'sortBy',
      'sortDir',
      'sortStash',
      'language',
      'shouldLogin',
      'currentTaskId',
      'currentFolderId',
      'playAlertVoice',
      'alertVoicevolume',
      'showCompleteTask',
      'showPlannedFolder',
      'showCalendarView',
      'showImportanceFolder'
    ]),
    ...mapGetters([
      'currentTask',
      'currentFolder'
    ])
  },

  mounted () {
    this.init()
    initShortCut()
    // Update data when window focus
    if (process.env.NODE_ENV !== 'development') {
      window.onfocus = () => this.init(false)
    }
    // Update data every 30 minute
    // setInterval(() => {
    //   this.init(false)
    // }, 1000 * 60 * 30)
  },

  beforeDestroy () {
    // Remove all listener before destroy
    ipcRenderer.removeAllListeners()
    // Remove all notification timer
    notify.clear()
  },

  watch: {
    tasks: {
      handler (newValue) {
        notify.create(newValue)
      },
      deep: true
    },
    currentTask: {
      handler () {
        ipcRenderer.send('update-touchbar', {
          ...this.currentTask,
          showCompleteTask: this.showCompleteTask
        })
      },
      deep: true
    },
    currentFolderId (newValue) {
      this.updateState({currentTaskId: null})
      ipcRenderer.sendSync('update-setting', {
        lastOpenFolder: newValue
      })
    },
    theme: {
      handler (newValue) {
        changeTheme(newValue)
        ipcRenderer.sendSync('update-setting', {theme: newValue})
      },
      immediate: true
    },
    language (newValue) {
      ipcRenderer.sendSync('update-setting', {language: newValue})
    },
    sortBy: 'updateTaskSetting',
    sortDir: 'updateTaskSetting',
    showCompleteTask (newValue) {
      ipcRenderer.sendSync('update-setting', {showCompleteTask: newValue})
      this.updateTaskSetting()
    },
    playAlertVoice (newValue) {
      ipcRenderer.sendSync('update-setting', {playAlertVoice: newValue})
    },
    alertVoicevolume (newValue) {
      ipcRenderer.sendSync('update-setting', {alertVoicevolume: newValue})
    },
    showCalendarView (newValue) {
      if (!newValue && this.$route.fullPath === '/setting') {
        this.$router.push('/')
      }
      ipcRenderer.sendSync('update-setting', {showCalendarView: newValue})
    },
    showPlannedFolder (newValue) {
      ipcRenderer.sendSync('update-setting', {showPlannedFolder: newValue})
    },
    showImportanceFolder (newValue) {
      ipcRenderer.sendSync('update-setting', {showImportanceFolder: newValue})
    }
    // shouldLogin () {

    // }
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
        await Promise.all([
          this.getTaskFolders(),
          this.getTasks()
        ])
        // await this.getUserPhoto()
        loading && loading.close()
      } catch (err) {
        // console.log(err)
        loading && loading.close()
      }
    },
    updateTaskSetting () {
      const sortStash = {
        ...this.sortStash,
        [this.currentFolder.Id]: {
          sortBy: this.sortBy,
          sortDir: this.sortDir,
          showCompleteTask: this.showCompleteTask
        }
      }
      this.updateState({sortStash})
      ipcRenderer.sendSync('update-setting', {sortStash})
    }
  }
}
</script>

<style lang="stylus">
#app
  background transparent
  width 100vw
  height 100vh
  display flex

main
  background transparent
  flex 1
  display flex
</style>
