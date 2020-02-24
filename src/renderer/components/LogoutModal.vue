<template lang="pug">
Modal.logout-modal(
  v-model="shouldLogout"
  position="bottom"
)
  div.logout-modal__content(
    v-loading="wvLoading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :element-loading-text="$t('base.loading')"
  )
    webview(
      ref="webview"
      src="https://login.microsoftonline.com/common/oauth2/v2.0/logout"
    )
    Header
      el-button(
        slot="right"
        @click="updateState({shouldLogout: false})"
      ) {{$t('base.cancel')}}
</template>

<script>
import { has } from '~/share/utils'
import { mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      wvLoading: false
    }
  },

  mounted () {
    this.$refs.webview.addEventListener('did-start-loading', () => {
      this.wvLoading = true
    })
    this.$refs.webview.addEventListener('did-finish-load', this.wvStateChange)
  },

  computed: {
    ...mapState(['shouldLogout'])
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    wvStateChange () {
      this.wvLoading = false
      const href = this.$refs.webview.getURL()
      if (has(href, 'logoutsession')) {
        this.updateState({
          shouldLogin: true,
          shouldLogout: false
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.logout-modal
  height 100vh
  display flex
  flex-direction column
  >>> .modal__main
    max-height 100vh !important
    height  100vh !important

webview
  flex 1
  width 100%

.logout-modal__content
  height 100vh
  display flex
  flex-direction column
</style>
