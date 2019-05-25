<template lang="pug">
Modal.login-modal(
  v-model="shouldLogin"
  position="bottom"
)
  div.login-modal__content(
    v-loading="wvLoading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-text="加载中"
  )
    webview(
      ref="webview"
      :src="loginUrl"
    )
    Header
      template
        el-button(
          circle
          icon="el-icon-arrow-left"
          @click="webviewBack"
        )
        el-button.u-ml100(
          circle
          icon="el-icon-arrow-right"
        )
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import { has, parseURL, objToForm, dater, Storage } from '@/common/utils'
import { AUTH_SCOPE, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '@/common/static'

const token = new Storage('TOKEN')
const LOGIN_ORIGIN = 'https://login.microsoftonline.com/common/oauth2/v2.0'

export default {
  data () {
    return {
      wvLoading: false,
      loginUrl: null
    }
  },

  mounted () {
    this.$refs.webview.addEventListener('did-start-loading', () => {
      this.wvLoading = true
    })
    this.$refs.webview.addEventListener('did-finish-load', this.wvStateChange)
  },

  computed: {
    ...mapState(['shouldLogin'])
  },

  watch: {
    shouldLogin (newValue) {
      if (newValue) this.login()
      else this.loginUrl = null
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
    login () {
      const query = {
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        response_mode: 'query',
        scope: AUTH_SCOPE,
        state: 12345
      }
      this.loginUrl = `${LOGIN_ORIGIN}/authorize?${objToForm(query)}`
    },
    async wvStateChange () {
      this.wvLoading = false
      const href = this.$refs.webview.getURL()
      const urlQuery = parseURL(href)
      if (has(href, ['http://localhost/myapp', 'code'], { strict: true })) {
        const url = `${LOGIN_ORIGIN}/token`
        const queryObj = {
          client_id: CLIENT_ID,
          scope: AUTH_SCOPE,
          code: urlQuery.code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
          client_secret: CLIENT_SECRET
        }

        const res = await this.$post(url, objToForm(queryObj), {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        })
        res.expires_time = dater().format('X') + res.expires_in
        token.set(res)
        this.updateState({token: res, shouldLogin: false})
        const loading = this.$loading({
          lock: true,
          text: '加载中',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        await this.getTaskFolders()
        await this.getTasks()
        loading.close()
      }
    },
    webviewBack () {
      if (this.$refs.webview.canGoBack()) {
        this.$refs.webview.goBack()
      }
    },
    webviewForword () {
      if (this.$refs.webview.canGoForward()) {
        this.$refs.webview.goForward()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.login-modal
  height 100vh
  display flex
  flex-direction column
  >>> .modal__main
    max-height 100vh !important
    height  100vh !important

webview
  flex 1
  width 100%

.login-modal__content
  height 100vh
  display flex
  flex-direction column
</style>
