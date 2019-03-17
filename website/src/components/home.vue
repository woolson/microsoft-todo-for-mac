<template lang="pug">
div.home
  header
    img(src="@/assets/logo.svg")
    div
      h1 图吧-Image Bed
      p 集图片裁剪、压缩、上传于一身，让你获取图片链接更方便
      div
        a(href="https://github.com/woolson/weibo-img/releases/download/v1.2.1/Image.Bed-1.2.1.dmg") 下载macOS版(1.2.1)
        //- a(href="http://public.woolson.cn/file/%E5%9B%BE%E5%90%A7-1.0.0.exe") Window
  section.home__thanks
    p 需要登录微博才能使用
    p
      span 感谢新浪微博提供的功能和部分代码参考
      a(href="https://github.com/fate-lovely/pic-on-weibo" target="_blank") pic-on-weibo
  section.home__intro
    el-carousel(indicator-position="outside" height="740px")
      el-carousel-item(v-for="item in etcs" :key="item")
        img(:src="item")
  footer
    div
      ul
        li 联系我
        li
          a(href="https://woolson.cn/blog/") 博客
      ul
        li 相关技术
        li
          a(
            target="_blank"
            href="https://simulatedgreg.gitbooks.io/electron-vue/content/cn/"
          ) vue-electron
        li
          a(
            target="_blank"
            href="https://electronjs.org/docs"
          ) electron
        li
          a(href="https://cn.vuejs.org/") vue
      ul
        li © 2018 woolson. All rights reserved
</template>

<script>
export default {
  name: 'home',

  data () {
    return {
      etcs: [
        require('@/assets/etc-4.png'),
        require('@/assets/etc-5.png'),
        require('@/assets/etc-6.png'),
        require('@/assets/etc-7.png'),
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.home
  header
    height 50vh
    background linear-gradient(0deg, $background, lighten($background, 13), $background)
    display flex
    justify-content center
    align-items center
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
      color $font
      text-decoration none
      &:hover
        // background linear-gradient(45deg, #1C9FFF, #765EE7)
        background linear-gradient(45deg, $blue, $green)
        border-color transparent
        color white
  section.home__thanks
    padding 20px 0
    p
      font-size 24px
      text-align center
      &:first-child
        font-weight bold
        text-decoration underline
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
</style>
