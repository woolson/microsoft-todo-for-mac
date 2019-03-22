<template lang="pug">
div#app
  WebView(v-if="!hasLogin")
  //- 侧边栏
  Sidebar
  //- 任务列表
  TaskList
  //- 任务详情弹窗
  TaskDetail
  //- 添加清单弹窗
  AddFolder
  //- 添加任务弹窗
  AddTask
  //- 设置弹窗
  Settings
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import initShortCut from './common/event'
import WebView from '@/components/WebView'
import Sidebar from '@/components/Sidebar'
import TaskList from '@/components/TaskList'
import TaskDetail from '@/components/TaskDetail'
import AddFolder from '@/components/AddFolder'
import AddTask from '@/components/AddTask'
import Settings from '@/components/Settings'
import { ipcRenderer } from 'electron'

export default {
  name: 'ms-todo',

  components: {
    WebView,
    Sidebar,
    TaskList,
    TaskDetail,
    AddFolder,
    AddTask,
    Settings
  },

  computed: {
    ...mapState({
      token: ({global}) => global.token,
      hasLogin: ({global}) => global.hasLogin,
      currentTask: ({global}) => global.currentTask,
      currentFolder: ({global}) => global.currentFolder,
      showCompleteTask: ({global}) => global.showCompleteTask
    })
  },

  mounted () {
    this.init()
    initShortCut()
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
    async init () {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        await this.getTaskFolders()
        await this.getTasks()
      } finally {
        loading.close()
      }
    }
  }
}
</script>

<style lang="stylus">
html
body
  font-family Segoe UI,SegoeUI,Segoe WP,Helvetica Neue,Helvetica,Tahoma,Arial,sans-serif

#app
  width 100vw
  height 100vh
  display flex
</style>
