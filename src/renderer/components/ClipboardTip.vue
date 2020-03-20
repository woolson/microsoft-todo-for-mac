<template lang="pug">
div.clipboard-tip(v-show="showClipboardTip")
  div.tip__head
    i.iconfont.icon-clipboard
    span 剪贴板内容
  div.tip__text {{clipboard}}
  el-button(
    size="mini"
    @click="updateState({\
      showTaskAddModal: true,\
      showClipboardTip: false,\
    })"
  ) {{$t('task.create')}}
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState([
      'clipboard',
      'showClipboardTip'
    ])
  },
  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    })
  }
}
</script>

<style lang="stylus" scoped>
.clipboard-tip
  position fixed
  left 0
  top 50vh
  z-index 10
  color var(--text-main)
  background var(--background-section)
  border-radius 0 20px 20px 0
  height 30px
  width 30px
  display flex
  flex-direction column
  align-items center
  cursor pointer
  transition all .2s
  box-shadow 0 0 5px rgba(black, .2)
  &:hover
    width 120px
    height 180px
    left 5px
    border-radius 5px
    .tip__head span
    .tip__text
    .el-button
      display flex

.tip__head
  width 100%
  display flex
  align-items center
  justify-content flex-start
  padding 6px
  box-sizing border-box
  span
    margin-left 5px
    display none
    white-space nowrap
    overflow hidden

.tip__text
  display none
  flex 1
  height 1px
  overflow auto
  word-break break-all
  padding 5px 8px
  background var(--background-content)
  width 100%
  box-sizing border-box

.el-button
  width 100%
  display none
  border-radius 0 0 5px 5px
  overflow hidden
  justify-content center
</style>
