<template lang="pug">
div.task-list
  Header(v-show="showSearch")
    el-input.u-flex-1(
      ref="search"
      v-model="searchStr"
      @keydown.27.native="cancelSearch"
    )
    el-button.u-ml20(
      slot="right"
      @click="cancelSearch"
      round
    ) {{$t('base.cancel')}}
  Header(v-if="!showSearch")
    div.task-list__title(slot="left")
      span.u-bold(
        :style="{color: showCompleteTask ? $color.green : $color.red}"
      ) &bull;
      span.u-ml10(:title="currentFolder.Name") {{currentFolder.Name}}
    Options(slot="right")
  transition-group.task-list__content(
    tag="div"
    name="complete"
    v-if="showSearch ? searchTasks.length : tasks.length"
  )
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
import Options from './Options'
import { has, isEmpty } from '@/common/utils'
import { nextTask } from '@/common/event'

export default {
  components: {
    Item,
    Options
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
    ...mapState([
      'taskFolders',
      'currentTask',
      'currentFolder',
      'sortDir',
      'sortBy',
      'showSearch',
      'showCompleteTask'
    ]),
    ...mapState({
      allTasks: 'tasks'
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
  position relative
  background var(--background-content)
  transition background .2s
  .header
    position absolute
    top 0
    right 0
    z-index 9
    width 100%
    color var(--text-sub)
    background var(--background-content)
    -webkit-app-region drag

.task-list__content
  padding 15px
  padding-top 65px
  transition background .2s
  flex 1
  overflow auto
  &::-webkit-scrollbar
    width 3px !important
  &::-webkit-scrollbar-thumb
    background rgba(black, .25)

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

.task-list__title
  outline none
  display inline-flex
  align-items center
  justify-content center
  > span:nth-child(2)
    font-size 16px
    font-weight bold
    max-width 150px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    color var(--text-main)
</style>
