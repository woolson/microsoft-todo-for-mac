<template lang="pug">
ul.tabbar
  li.tabbar__item.iconfont.icon-tasks(
    :class="{active: $route.fullPath === '/'}"
    @click="$router.push('/')"
  )
  li.tabbar__item.iconfont.icon-calendar(
    :class="{active: $route.fullPath === '/calendar'}"
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
  line-height 30px
  margin 0
  align-items center
  color var(--folder-color)
  box-shadow 0 0 1px rgba(black, .2)
  padding 30px 0 10px 0
  li
    margin 10px 0
    cursor pointer
    font-size 22px !important
    opacity .6
    &.icon-function
    &.icon-calendar
      font-weight bold
    &.active
      opacity 1

.icon-setting
.icon-setting-active
  margin-top auto !important
  font-size 24px !important
</style>
