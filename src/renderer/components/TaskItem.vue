<template lang="pug">
div.task-item.u-bb(
  :class="{active: currentTask.Id === data.Id}"
  @click="updateState({currentTask: data, showTaskDetail: true})"
)
  i.iconfont(
    :class="checkClass"
    @click.stop="changeTaskStatus"
  )
  div.task-item__content
    h1(:style="titleStyle") {{data.Subject}}
    i.iconfont(
      :class="starClass"
      @click.stop="changeTaskImportance"
    )
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

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
      const { Status } = this.data
      return {
        textDecoration: Status === 'Completed' ? 'line-through' : 'none',
        color: Status === 'Completed' ? '#AAAAAA' : ''
      }
    },
    checkClass () {
      return this.data.Status === 'Completed' ? 'icon-check' : 'icon-check-o'
    },
    starClass () {
      return this.data.Importance === 'High' ? 'icon-star' : 'icon-star-o'
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    ...mapActions({
      updateTask: 'UPDATE_TASK'
    }),
    async changeTaskStatus () {
      try {
        await this.updateTask({
          Id: this.data.Id,
          Status: this.data.Status === 'Completed' ? 'NotStarted' : 'Completed'
        })
        this.$message.success('更新成功')
      } catch (err) {
        this.$message.error('更新失败')
      }
    },
    async changeTaskImportance () {
      try {
        await this.updateTask({
          Id: this.data.Id,
          Importance: this.data.Importance === 'High' ? 'Normal' : 'High'
        })
        this.$message.success('更新成功')
      } catch (err) {
        this.$message.error('更新失败')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-item
  display flex
  align-items center
  background $background-color
  padding 15px
  background-size 0px 100%
  position relative
  transition all .2s
  cursor pointer
  user-select none
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
    font-size 14px
    font-weight normal
    margin 0
    color $text
  i
    position absolute
    right 15px
    top 15px
    &.icon-star
      color $yellow
</style>

