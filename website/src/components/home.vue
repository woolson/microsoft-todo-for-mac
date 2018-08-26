<template lang="pug">
div.home
  header
    img(src="@/assets/icon.svg")
    div
      h1 Microsoft To-Do
      p 微软出品 — 简洁清爽的TODO清单免费软件
      div
        a(href="http://public.woolson.cn/file/To-Do-1.4.0.dmg") MacOS
        a(href="https://itunes.apple.com/cn/app/microsoft-to-do/id1212616790?mt=8") iPhone
        a(href="https://www.microsoft.com/zh-cn/p/microsoft-to-do/9nblggh5r558?rtc=1") Window
        a(href="https://play.google.com/store/apps/details?id=com.microsoft.todos") Android
  section.home__feature
    div
      div.title
        h3 特性
        sub （修改和增加）
      ul
        li
          img(src="@/assets/macos.svg")
          span macOS
        li
          img(src="@/assets/shortcut.svg")
          span 快捷键
        li
          img(src="@/assets/theme.svg")
          span 暗黑主题
  section.home__intro
    el-carousel(indicator-position="outside" height="500px")
      el-carousel-item(v-for="item in etcs" :key="item")
        img(:src="item")
  footer
    div
      ul
        li 联系我
        li
          a(href="https://woolson.cn/blog/") 博客
      ul
        li 相关技术
        li
          a(
            target="_blank"
            href="https://electronjs.org/docs"
          ) electron
      ul
        li © 2018 woolson. All rights reserved
</template>

<script>
export default {
  name: 'home',

  data () {
    return {
      etcs: [
        require('@/assets/etc-01.png'),
        require('@/assets/etc-02.png'),
        require('@/assets/etc-03.png'),
        require('@/assets/etc-04.png')
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "../styles/variables.styl"
.home
  header
    height 50vh
    /* background linear-gradient(0deg, $background, lighten($background, 13), $background) */
    background linear-gradient(45deg, #1C9FFF, #765EE7)
    display flex
    justify-content center
    align-items center
    color white
    img
      margin-right 50px
      height 200px
      box-shadow 0 0 40px rgba(black, .25)
      border-radius 40px
    h1
      font-size 40px
      margin-top 0
    a
      display inline-block
      margin-top 5px
      padding 10px 40px
      border none
      margin-right 20px
      font-size 14px
      border-radius 5px
      cursor pointer
      outline none
      border 1px solid $gray
      color white
      text-decoration none
      background rgba(black, .3)
      &:hover
        background linear-gradient(45deg, #1C9FFF, #765EE7)
        border-color transparent
        color white
  section.home__intro
    margin-bottom 50px
    img
      height 750px
    .el-carousel__item
      text-align center
  footer
    background #f2f2f2
    display flex
    padding 50px
    align-items center
    justify-content center
    div
      width 950px
      display flex
    ul
      font-size 12px
      list-style none
      margin 0
      padding 0
      margin-right 50px
      li
        padding 5px 0
        a
          text-decoration none
          color $font
          &:hover
            text-decoration underline
        &:first-child
          font-weight bold
      &:last-child
        margin-left auto
  .home__feature
    padding 40px 0
    background linear-gradient(180deg, $background, lighten($background, 13))
    > div
      margin 0 auto
      width 950px
    .title
      text-align center
    h3
      color #4A9DF7
      font-size 40px
      text-align center
      margin-top 0
      margin-bottom 0
    ul
      padding 0
      display flex
      justify-content space-around
      li
        display flex
        flex-direction column
        img
          height 80px
        span
          text-align center
          margin-top 10px
</style>
