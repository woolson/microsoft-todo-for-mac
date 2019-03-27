<!-- 分步 -->

<template lang="pug">
div.steps(ref="root")
  slot
</template>

<script>
export default {
  name: 'Steps',

  props: {
    value: Number,
    zIndex: {
      type: Number,
      default: 99
    }
  },

  watch: {
    // 检查到变化调整step的位置
    value (newValue, oldValue) {
      let $children = this.$refs.root.children
      let oldStep = $children[oldValue]
      let newStep = $children[newValue]

      this.range(0, $children.length - 1).forEach(index => {
        let position = index > newValue ? '100%' : '-100%'

        if ($children[index].style.marginLeft !== position) {
          $children[index].style.marginLeft = position
        }
        if ($children[index].style.zIndex !== this.zIndex) {
          $children[index].style.zIndex = this.zIndex
        }
      })

      newStep.style.marginLeft = 0
      oldStep.style.zIndex = this.zIndex + 1
      newStep.style.zIndex = this.zIndex + 1
    }
  },

  methods: {
    range (start, end) {
      let length = end - start + 1
      let result = []
      for (let i = 0; i < length; i++) {
        result.push(start + i)
      }
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
.steps
  display flex
  position relative
  overflow hidden
  height 100vh
  > div
    position absolute
    transition margin-left .3s ease-in-out
    width 100%
    flex-shrink 0
    &:not(:first-child)
      margin-left 100%
</style>
