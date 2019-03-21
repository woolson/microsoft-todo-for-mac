<template lang="pug">
div.task-list
  Header
    span.u-mlauto.u-pointer(
      slot="left"
      v-show="tasks.length"
      @click="updateState({sort: !sort})"
    )
      i.iconfont.u-pointer.u-s12(
        :class="sort ? 'icon-down' : 'icon-up'"
      )
      span.u-ml5 排序
    el-popover(
      placement="bottom"
      width="200"
      trigger="click"
    )
      div.task-list__options
        div.u-bb
          span.u-mrauto 显示已完成任务
          el-switch(
            active-color="#3DC550"
            inactive-color="#FA6260"
            :value="showCompleteTask"
            @change="updateState({showCompleteTask: !showCompleteTask})"
          )
        p(
          v-show="currentFolder.Id"
          @click="deleteTaskFolder"
        ) 删除清单
      div.task-list__title(slot="reference")
        span.u-bold(
          :style="{color: showCompleteTask ? '#3DC550' : '#FA6260'}"
        ) &bull;
        span.u-ml10 {{currentFolder.Name}}
        i.iconfont.icon-down-o.u-ml10.u-s5
    el-tooltip(
      slot="right"
      content="新建任务"
      placement="left"
    )
      el-button.u-ml10(
        size="mini"
        circle
        icon="el-icon-plus"
        @click="updateState({showTaskAddModel: true})"
      )
  div.task-list__content(v-if="tasks.length")
    TaskItem(
      v-for="item in tasks"
      :data="item"
      :key="item.Id"
    )
  div.task-list__empty(v-else)
    i.iconfont.icon-empty
    span 清单暂无任务
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
      taskFolders: ({global}) => global.taskFolders,
      currentFolder: ({global}) => global.currentFolder,
      sort: ({global}) => global.sort,
      showCompleteTask: ({global}) => global.showCompleteTask
    }),
    ...mapGetters(['tasks'])
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    async deleteTaskFolder () {
      try {
        await this.$confirm(`确认删除清单 ${this.currentFolder.Name} ？`, '注意', { center: true })
        try {
          await this.$fetch('delete', `/me/taskfolders/${this.currentFolder.Id}`)
          const taskFolders = [...this.taskFolders]
          const taskIndex = this.taskFolders.findIndex(o => o.Id === this.currentFolder.Id)
          taskFolders.splice(taskIndex, 1)
          this.updateState({taskFolders, currentFolder: taskFolders[taskIndex - 1]})
          this.$message.success('删除成功')
        } catch (err) {
          this.$message.error('删除失败')
        }
      } catch (err) {
        console.log('已取消', err)
      }
    }
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

.task-list__empty
  flex 1
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding-bottom 50px
  i
    color $gray
    font-size 180px
  span
    color $gray
    margin-top 10px
    font-size 14px

.task-list__options
  > div
    display flex
    padding 10px 12px
    user-select none
  p
    color $red
    cursor pointer
    padding 10px 12px
    margin 0
    border-radius 0 0 5px 5px
    transition all .2s
    background white
    &:hover
      color white
      background $red

.task-list__title
  outline none
  display flex
  align-items center
  justify-content center
</style>
