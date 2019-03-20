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
import WebView from '@/components/WebView'
import Sidebar from '@/components/Sidebar'
import TaskList from '@/components/TaskList'
import TaskDetail from '@/components/TaskDetail'
import AddFolder from '@/components/AddFolder'
import AddTask from '@/components/AddTask'
import Settings from '@/components/Settings'

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
      hasLogin: ({global}) => global.hasLogin
    })
  },

  mounted () {
    this.getTaskFolders()
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

<style lang="stylus">
html
body
  font-family Segoe UI,SegoeUI,Segoe WP,Helvetica Neue,Helvetica,Tahoma,Arial,sans-serif

#app
  width 100vw
  height 100vh
  display flex
</style>
