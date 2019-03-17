<!-- 弹窗组件 -->

<template lang="pug">
div.model(
  :class="'model--' + position"
  v-show="showRoot"
)
  div.model__main.u-slide(
    v-toggle-class="value"
    :toggle-class="getViewClass"
    :style="getViewStyle"
    :class="mainClass"
  )
    slot
  div.model__mask.u-fade(
    v-if="needMask"
    v-toggle-class="value"
    :toggle-class="['in', 'out']"
    @click="cancel"
  )
</template>

<script>
import { has } from '@/common/utils'

export default {
  name: 'Model',

  props: {
    // 是否显示弹窗
    value: {
      type: Boolean,
      default: false
    },
    // 弹窗内容位置
    position: {
      type: String,
      default: 'right',
      validator (value) {
        return has(['left', 'top', 'right', 'bottom', 'center'], value)
      }
    },
    // 弹窗内容宽度
    width: {
      type: String
    },
    // 弹窗内容高度
    height: {
      type: String
    },
    // 是否需要蒙层
    needMask: {
      type: Boolean,
      default: true
    },
    // 弹窗容器class
    mainClass: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      showRoot: this.value
    }
  },

  computed: {
    getViewStyle () {
      let style = {}
      if (this.height) style.height = this.height
      if (this.width) style.width = this.width
      return style
    },
    getViewClass () {
      switch (this.position) {
        case 'left':
          return ['right-in', 'left-out']
        case 'right':
          return ['left-in', 'right-out']
        case 'top':
          return ['bottom-in', 'top-out']
        case 'bottom':
          return ['top-in', 'bottom-out']
        case 'center':
          return ['fade-in', 'fade-out']
      }
    }
  },

  watch: {
    value (newValue) {
      if (newValue) {
        this.showRoot = true
      } else {
        setTimeout(() => {
          this.showRoot = false
        }, 300)
      }
    }
  },

  methods: {
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="stylus" scoped>
.model
  height 100vh
  width 100vw
  display flex
  position fixed
  left 0
  top 0
  z-index 999

.model__main
  display flex
  flex-direction column
  background white
  position relative
  z-index 99
  overflow hidden
  box-shadow 0 0 15px rgba(black, .2)

.model--right
  flex-direction row-reverse
.model--top
  flex-direction column
.model--bottom
  flex-direction column-reverse

.model--left
.model--right
  .model__main
    height 100vh
    width 55vw

.model--top
.model--bottom
  .model__main
    height 50vh
    width 100vw

.model--center
  .model__main
    height 50vh
    width 60vw
    left 50%
    top 50%
    transform translate(-50%,-50%)
    border-radius 1rem

.model__mask
  height 100vh
  width 100vw
  top 0
  left 0
  position fixed
  background rgba(0, 0, 0, .45)
</style>
