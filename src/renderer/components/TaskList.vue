<template lang="pug">
div.task-list
  div.task-list__header.u-bb
    h1 清单：{{currentFolder.name}}
    span.u-mlauto.u-pointer(
      @click="updateState({sort: !sort})"
    )
      i.iconfont.u-pointer(:class="sort ? 'icon-down' : 'icon-up'")
      span.u-ml10 切换排序
  div.task-list__content
    TaskItem(
      v-for="item in tasks"
      :data="item"
      :key="item.id"
    )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import TaskItem from './TaskItem'

export default {
  components: {
    TaskItem
  },

  computed: {
    ...mapState({
      currentFolder: ({global}) => global.currentFolder,
      sort: ({global}) => global.sort
    }),
    ...mapGetters(['tasks'])
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    })
  }
}
</script>

<style lang="stylus" scoped>
.task-list
  flex 1

.task-list__header
  display flex
  align-items baseline
  // margin-bottom 10px
  padding 10px 15px
  user-select none
  h1
    margin 0
    font-size 16px
    color $text

.task-list__content
  padding 15px
</style>
