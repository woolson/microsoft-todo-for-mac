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
  Header(v-if="!showSearch" :class="{'blur-bg': blurTop}")
    div.task-list__title(slot="left")
      span.u-bold(
        :style="{color: showCompleteTask ? $color.green : $color.red}"
      ) &bull;
      span.u-ml10(:title="currentFolder.Name") {{currentFolder.Name}}
    Options(slot="right")
  div.task-list__content(
    v-if="showSearch ? searchTasks.length : tasks.length"
    @scroll="onScroll"
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
import { has, isEmpty } from '~/share/utils'
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
      },
      blurTop: false
    }
  },

  computed: {
    ...mapState([
      'sortDir',
      'sortBy',
      'showSearch',
      'showCompleteTask'
    ]),
    ...mapState({
      allTasks: 'tasks'
    }),
    ...mapGetters([
      'tasks',
      'currentTask',
      'currentFolder'
    ]),
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
    },
    onScroll (evt) {
      this.blurTop = evt.target.scrollTop > 10
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-list
  flex 1
  display flex
  flex-direction column
  position relative
  background var(--background-right-content)
  transition background .2s
  .header
    position absolute
    top 0
    right 0
    z-index 9
    width 100%
    color var(--text-sub)
    // background var(--background-content)
    -webkit-app-region drag
    &.blur-bg
      backdrop-filter saturate(180%) blur(20px)

.task-list__content
  padding 15px
  padding-top 55px
  transition background .2s
  flex 1
  overflow auto

.task-list__empty
  flex 1
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding-bottom 50px
  color var(--text-main)
  opacity .5
  i
    font-size 180px
  span
    margin-top 10px
    font-size 14px

.task-list__title
  outline none
  display inline-flex
  align-items center
  justify-content center
  > span:nth-child(2)
    $size-text-large
    font-weight bold
    max-width 150px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    color var(--text-main)
</style>
