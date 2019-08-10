<template lang="pug">
ul.tabbar
  li.tabbar__item.iconfont(
    :class="$route.fullPath === '/' ? 'icon-function-active' : 'icon-function'"
    @click="$router.push('/')"
  )
  li.tabbar__item.iconfont(
    :class="$route.fullPath === '/calendar' ? 'icon-calendar-active' : 'icon-calendar'"
    @click="$router.push('/calendar')"
  )
  li.tabbar__item.iconfont(
    :class="$route.fullPath === '/setting' ? 'icon-setting-active' : 'icon-setting'"
    @click="$router.push('/setting')"
  )
</template>

<style lang="stylus" scoped>
.tabbar
  -webkit-app-region drag
  background var(--background-sidebar)
  height 100vh
  width 70px
  box-sizing border-box
  list-style none
  z-index 10
  display flex
  flex-shrink 0
  flex-direction column
  line-height 50px
  margin 0
  padding 0
  align-items center
  // justify-content center
  color var(--folder-color)
  // border-right 1px solid rgba(black, .1)
  box-shadow 0 0 1px rgba(black, .2)
  padding 20px 0
  li
    margin 10px 0
    cursor pointer
    font-size 22px !important
    &.icon-function
    &.icon-calendar
      font-weight bold
    &[class$="active"]
      color $blue

.icon-setting
.icon-setting-active
  margin-top auto !important
  font-size 24px !important
</style>
