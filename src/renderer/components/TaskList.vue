<template lang="pug">
div.task-list
  div.task-list__header
    h1 清单：{{currentFolder.Name}}
    span.u-mlauto.u-pointer(
      @click="updateState({sort: !sort})"
    )
      i.iconfont.u-pointer.u-s12(:class="sort ? 'icon-down' : 'icon-up'")
      span.u-ml5 切换排序
    el-button.u-ml10(
      size="mini"
      type="success"
    ) 新建任务
  div.task-list__content
    TaskItem(
      v-for="item in tasks"
      :data="item"
      :key="item.Id"
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
  display flex
  flex-direction column
  height 100vh

.task-list__header
  flex-shrink 0
  display flex
  align-items center
  // margin-bottom 10px
  box-shadow 0 0 5px rgba(black, .1)
  padding 10px 15px
  user-select none
  -webkit-app-region drag
  h1
    margin 0
    font-size 16px
    color $text

.task-list__content
  padding 15px
  flex 1
  overflow auto
</style>
