<template lang="pug">
div.task-list
  Header(v-show="showSearch")
    el-input.u-flex-1(
      ref="search"
      v-model="searchStr"
      @keydown.27.native="cancelSearch"
    )
    el-button(
      slot="right"
      @click="cancelSearch"
      round
    ) {{$t('base.cancel')}}
  Header(v-if="!showSearch")
    span.u-pointer(
      slot="left"
      v-show="tasks.length"
      @click="updateState({sort: !sort})"
    )
      i.iconfont.u-pointer.u-s12(
        :class="sort ? 'icon-down' : 'icon-up'"
      )
      span.u-ml5 {{$t('base.sort')}}
    el-popover(
      placement="bottom"
      width="200"
      trigger="hover"
    )
      div.task-list__options
        div.u-bb
          span.u-mrauto {{$t('task.showCompleted')}}
          el-switch(
            :active-color="$color.green"
            :inactive-color="$color.red"
            :value="showCompleteTask"
            @change="updateState({showCompleteTask: !showCompleteTask})"
          )
        p.rename.u-bb(
          v-show="currentFolder.Id && !has(['任务', 'Task', 'task'], currentFolder.Name)"
          @click="renameTaskFolder"
        ) {{$t('base.rename')}}
        p.delete(
          v-show="currentFolder.Id && !has(['任务', 'Task', 'task'], currentFolder.Name)"
          @click="deleteTaskFolder"
        ) {{$t('base.delete')}}
      div.task-list__title(slot="reference")
        span.u-bold(
          :style="{color: showCompleteTask ? $color.green : $color.red}"
        ) &bull;
        span.u-ml10 {{currentFolder.Name}}
        i.iconfont.icon-down-o.u-ml10.u-s5
    el-tooltip(
      slot="right"
      :content="$t('task.create')"
      placement="left"
    )
      el-button.u-ml10(
        size="mini"
        circle
        icon="el-icon-plus"
        @click="updateState({showTaskAddModal: true})"
      )
  div.task-list__content(v-if="showSearch ? searchTasks.length : tasks.length")
    Item(
      v-for="item in showSearch ? searchTasks : tasks"
      :data="item"
      :key="item.Id"
    )
  div.task-list__empty(v-else)
    i.iconfont.icon-empty
    span {{$t('folder.empty')}}
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import Item from './Item'
import { ipcRenderer } from 'electron'
import { has, isEmpty } from '@/common/utils'
import { nextTask } from '@/common/event'

export default {
  components: {
    Item
  },

  data () {
    return {
      has,
      searchStr: '',
      cache: {
        showCompleteTask: false,
        currentFolder: {}
      }
    }
  },

  computed: {
    ...mapState({
      taskFolders: ({global}) => global.taskFolders,
      currentTask: ({global}) => global.currentTask,
      currentFolder: ({global}) => global.currentFolder,
      sort: ({global}) => global.sort,
      allTasks: ({global}) => global.tasks,
      showSearch: ({global}) => global.showSearch,
      showCompleteTask: ({global}) => global.showCompleteTask
    }),
    ...mapGetters(['tasks']),
    searchTasks () {
      if (!this.searchStr) return []
      return this.allTasks.filter(o => {
        return has(o.Subject.toLowerCase(), this.searchStr.toLowerCase())
      })
    }
  },

  watch: {
    showSearch (newValue) {
      if (!newValue) {
        window.removeEventListener('keydown', this.moveTask, true)
      } else {
        window.addEventListener('keydown', this.moveTask, true)
        this.cache = {
          showCompleteTask: this.showCompleteTask,
          currentFolder: this.currentFolder
        }
        this.updateState({showCompleteTask: true, currentFolder: {}})
        this.$nextTick(this.$refs.search.focus)
      }
    }
  },

  methods: {
    ...mapActions({
      updateTask: 'UPDATE_TASK',
      deleteFolder: 'DELETE_FOLDER'
    }),
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    async deleteTaskFolder () {
      const result = ipcRenderer.sendSync('delete-folder', this.currentFolder)
      if (result) {
        try {
          await this.deleteFolder()
          this.$message.success('删除成功')
        } catch (err) {
          this.$message.error('删除失败')
        }
      }
    },
    renameTaskFolder () {
      this.updateState({
        currentFolder: {...this.currentFolder, Type: 'Rename'},
        showTaskFolderAddModal: true
      })
    },
    cancelSearch () {
      this.searchStr = ''
      this.updateState({
        showSearch: false,
        ...this.cache
      })
      this.cache = {}
    },
    moveTask (evt) {
      if (!has([38, 40, 13], evt.keyCode)) return
      evt.stopPropagation()
      if (evt.keyCode === 13 && !isEmpty(this.currentTask)) {
        this.updateState({showTaskDetailModal: true})
      } else {
        nextTask(evt.keyCode === 40 ? 1 : -1, this.searchTasks)
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
    cursor pointer
    padding 10px 12px
    margin 0
    transition all .2s
    background white
    &.rename
      color $green
      &:hover
        background $green
    &.delete
      color $red
      border-radius 0 0 5px 5px
      &:hover
        background $red
    &:hover
      color white

.task-list__title
  outline none
  display flex
  align-items center
  justify-content center
</style>
