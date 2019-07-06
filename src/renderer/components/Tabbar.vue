<template lang="pug">
ul.tabbar
  li.tabbar__item.el-icon-menu(
    @click="$router.push('/')"
  )
  li.tabbar__item.el-icon-date(
    @click="$router.push('/calendar')"
  )
  li.tabbar__item.el-icon-s-tools(
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
  font-size 26px
  margin 0
  padding 0
  align-items center
  // justify-content center
  color white
  border-right 1px solid rgba(black, .1)
  padding 20px 0
  li
    margin 10px 0

.el-icon-s-tools
  margin-top auto !important
</style>
