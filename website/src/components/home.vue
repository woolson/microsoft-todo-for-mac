<template lang="pug">
div.home
  header
    img(src="@/assets/icon.svg")
    div
      h1 Microsoft ToDo
      p Microsoft ToDo client for macOS, based on Electron & Vue.
      div
        a(href="https://github.com/woolson/microsoft-todo-mac") MacOS
        a(href="https://itunes.apple.com/cn/app/microsoft-to-do/id1212616790?mt=8") iPhone
        a(href="https://www.microsoft.com/zh-cn/p/microsoft-to-do/9nblggh5r558?rtc=1") Window
        a(href="https://play.google.com/store/apps/details?id=com.microsoft.todos") Android
  section.home__feature
    div
      div.title Features
      ul
        li(v-for="item in features" :key="item.label")
          img(:src="item.src")
          span {{item.label}}
  section.home__intro
    el-carousel(indicator-position="outside" height="600px")
      el-carousel-item(v-for="item in etcs" :key="item")
        img(:src="item")
  footer
    div
      ul
        li Contact
        li
          a(href="https://woolson.cn/blog/") Blog
      ul
        li Tech
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
      features: [
        {label: 'macOS', src: require('@/assets/macos.svg')},
        {label: 'TouchBar', src: require('@/assets/touch.svg')},
        {label: 'Shortcut', src: require('@/assets/shortcut.svg')},
        {label: 'Dark Mode', src: require('@/assets/theme.svg')},
        {label: 'Language', src: require('@/assets/language.svg')}
      ],
      etcs: [
        // require('@/assets/etc-01.png'),
        // require('@/assets/etc-02.png'),
        require('@/assets/etc-10.png'),
        require('@/assets/etc-11.png'),
        require('@/assets/etc-08.png'),
        require('@/assets/etc-09.png'),
        require('@/assets/etc-07.png')
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
        color white
  section.home__intro
    margin-bottom 50px
    img
      height 850px
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
    padding 30px 0
    background linear-gradient(180deg, $background, lighten($background, 13))
    > div
      margin 0 auto
      width 950px
    .title
      text-align center
      color #4A9DF7
      font-size 40px
      text-align center
      margin-bottom 30px
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
