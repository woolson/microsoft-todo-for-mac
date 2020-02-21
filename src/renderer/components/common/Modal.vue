<!-- 弹窗组件 -->

<template lang="pug">
div.modal(
  ref="modal"
  :class="'modal--' + position"
  v-show="showRoot"
)
  div.modal__main.u-slide(
    v-toggle-class="value"
    :toggle-class="getViewClass"
    :style="getViewStyle"
    :class="mainClass"
  )
    slot
  div.modal__mask.u-fade(
    v-if="needMask"
    v-toggle-class="value"
    :toggle-class="['in', 'out']"
    @click="cancel"
  )
</template>

<script>
import { has } from '@/common/utils'

export default {
  name: 'Modal',

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
        const lastIndex = this.getLastIndex()
        if (+this.$refs.modal.style.zIndex < lastIndex) {
          this.$refs.modal.style.zIndex = lastIndex + 1
        }
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
    },
    getLastIndex () {
      const $domAll = Array.from(document.all)
      return Math.max(...$domAll.map(dom => {
        const zIndex = dom.style.zIndex
        return isNaN(zIndex) ? -1 : zIndex
      }))
    }
  }
}
</script>

<style lang="stylus" scoped>
.modal
  height 100vh
  width 100vw
  display flex
  position fixed
  left 0
  top 0
  z-index 999

.modal__main
  display flex
  flex-direction column
  background var(--background-content)
  position relative
  z-index 99
  overflow hidden
  box-shadow 0 0 15px rgba(black, .2)
  transition background .2s

.modal--right
  flex-direction row-reverse
.modal--top
  flex-direction column
.modal--bottom
  flex-direction column-reverse

.modal--left
.modal--right
  .modal__main
    height 100vh
    width 60vw
    max-width 400px
    min-width 350px

.modal--top
.modal--bottom
  .modal__main
    height 50vh
    width 100vw

.modal--center
  .modal__main
    height 50vh
    width 60vw
    left 50%
    top 50%
    transform translate(-50%,-50%)
    border-radius 1rem

.modal__mask
  height 100vh
  width 100vw
  top 0
  left 0
  position fixed
  backdrop-filter saturate(30%) blur(2px)
  background rgba(black, .3)
</style>
