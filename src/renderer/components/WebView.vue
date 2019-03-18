<template lang="pug">
webview(
  ref="webview"
  v-loading="wvLoading"
  :src="loginUrl"
)
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { has, parseURL, objToForm, dater, Storage } from '@/common/utils.js'

const token = new Storage('TOKEN')

export default {
  data () {
    return {
      wvLoading: false,
      loginUrl: null
    }
  },

  mounted () {
    this.login()
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    ...mapActions({
      getTaskFolders: 'GET_TASK_FOLDERS'
    }),
    login () {
      const query = {
        client_id: '6731de76-14a6-49ae-97bc-6eba6914391e',
        response_type: 'code',
        redirect_uri: 'http%3A%2F%2Flocalhost%2Fmyapp%2F',
        response_mode: 'query',
        scope: 'https://outlook.office.com/tasks.readwrite',
        state: 12345
      }
      this.loginUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${objToForm(query)}`
      this.$nextTick(() => {
        this.$refs.webview.addEventListener('did-start-loading', () => {
          this.wvLoading = true
        })
        this.$refs.webview.addEventListener('did-finish-load', this.wvStateChange)
      })
    },
    async wvStateChange () {
      const href = this.$refs.webview.getURL()
      const urlQuery = parseURL(href)
      if (has(href, ['http://localhost/myapp', 'code'], { strict: true })) {
        const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
        const queryObj = {
          client_id: '6731de76-14a6-49ae-97bc-6eba6914391e',
          scope: 'https://outlook.office.com/tasks.readwrite',
          code: urlQuery.code,
          redirect_uri: 'http%3A%2F%2Flocalhost%2Fmyapp%2F',
          grant_type: 'authorization_code',
          client_secret: 'JqQX2PNo9bpM0uEihUPzyrh'
        }

        const res = await this.$post(url, objToForm(queryObj), {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        })
        res.expires_time = dater().format('X') + res.expires_in
        token.set(res)
        this.updateState({token: res, hasLogin: true})
        this.getTaskFolders()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
webview
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  z-index 99
</style>

