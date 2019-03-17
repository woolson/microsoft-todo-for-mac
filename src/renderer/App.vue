<template lang="pug">
div#app
  WebView(v-if="!hasLogin")
  Sidebar
  TaskList
  TaskDetail
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { dater, objToForm } from '@/common/utils'
import WebView from '@/components/WebView.vue'
import Sidebar from '@/components/Sidebar.vue'
import TaskList from '@/components/TaskList.vue'
import TaskDetail from '@/components/TaskDetail.vue'

export default {
  name: 'ms-todo',

  components: {
    WebView,
    Sidebar,
    TaskList,
    TaskDetail
  },

  computed: {
    ...mapState({
      token: ({global}) => global.token,
      hasLogin: ({global}) => global.hasLogin
    })
  },

  mounted () {
    this.getTaskFolders()
    // const current = dater().format('X')
    // if (isEmpty(this.token)) {
    //   this.updateState({hasLogin: false})
    // } else if (this.token.expired_time < current) {
    //   this.refreshToken()
    // } else {
    //   this.updateState({hasLogin: true})
    //   this.getTaskFolders()
    // }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    ...mapActions({
      getTaskFolders: 'GET_TASK_FOLDERS'
    }),
    async refreshToken () {
      const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
      const queryObj = {
        client_id: '6731de76-14a6-49ae-97bc-6eba6914391e',
        scope: 'user.read%20Tasks.ReadWrite.Shared',
        refresh_token: this.token.refresh_token,
        redirect_uri: 'http%3A%2F%2Flocalhost%2Fmyapp%2F',
        grant_type: 'refresh_token',
        client_secret: 'JqQX2PNo9bpM0uEihUPzyrh'
      }

      const res = await this.$post(url, objToForm(queryObj), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      res.expires_time = dater().format('X') + res.expires_in
      this.updateState({token: res})
      this.getTaskFolders()
    }
  }
}
</script>

<style lang="stylus">
#app
  width 100vw
  height 100vh
  display flex
</style>
