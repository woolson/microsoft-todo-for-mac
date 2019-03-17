<template lang="pug">
div.task-item.u-bb(
  :class="{active: currentTask.id === data.id}"
  @click="updateState({currentTask: data, showTaskDetail: true})"
)
  i.iconfont(:class="checkClass")
  div.task-item__content
    h1(:style="titleStyle") {{data.subject}}
    i.iconfont(:class="starClass")
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapState({
      currentTask: ({global}) => global.currentTask
    }),
    titleStyle () {
      const { status } = this.data
      return {
        textDecoration: status === 'completed' ? 'line-through' : 'none',
        color: status === 'completed' ? '#AAAAAA' : ''
      }
    },
    checkClass () {
      return this.data.status === 'completed' ? 'icon-check' : 'icon-check-o'
    },
    starClass () {
      return this.data.importance === 'high' ? 'icon-star' : 'icon-star-o'
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    })
  }
}
</script>

<style lang="stylus" scoped>
.task-item
  display flex
  align-items center
  background $background-color
  padding 12px
  background-size 0px 100%
  position relative
  transition all .2s
  cursor pointer
  > i
    font-size 18px
    margin-right 10px
    &.icon-check
      color $green
  &:first-child
    border-radius 5px 5px 0 0
  &:last-child
    border-radius 0 0 5px 5px
    &:after
      display none
  &:hover
    background rgba($blue, .1)
    // background linear-gradient(45deg, #1c9fff, #765ee7)

.task-item__content
  h1
    font-size 15px
    font-weight normal
    margin 0
    color $text
  i
    position absolute
    right 10px
    top 10px
    &.icon-star
      color $yellow
</style>

