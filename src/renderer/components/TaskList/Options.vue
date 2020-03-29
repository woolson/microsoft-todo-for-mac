<template lang="pug">
div.task-options
  el-popover(
    trigger="hover"
    placement="bottom"
    transition="none"
    :close-delay="0"
  )
    el-button.button-more(
      slot="reference"
      size="mini"
      icon="el-icon-setting"
    )
    div.task-options__title
      i.el-icon-back(
        v-show="currentStep"
        @click="currentStep = 0"
      )
      h1 {{$t('base.options')}}
    div.task-options__list
      li.u-form__row
        span.u-mrauto {{$t('base.completed')}}
        el-switch(
          :active-color="$color.green"
          :inactive-color="$color.red"
          :value="showCompleteTask"
          @change="updateState({showCompleteTask: !showCompleteTask})"
        )
      li.u-form__row.rename(
        v-show="dontDelete"
        @click="renameTaskFolder"
      ) {{$t('base.rename')}}
      li.u-form__row.delete(
        v-show="dontDelete"
        @click="deleteTaskFolder"
      ) {{$t('base.delete')}}
  el-popover(
    trigger="hover"
    placement="bottom"
    transition="none"
    :close-delay="0"
  )
    el-button.button-sort(
      slot="reference"
      size="mini"
      icon="el-icon-s-operation"
    )
    div.task-options__title
      i.el-icon-back(
        v-show="currentStep"
        @click="currentStep = 0"
      )
      h1 {{$t('base.sort')}}
    div.task-options__sort
      li.u-form__row(
        v-for="item in sortList"
        @click="updateState({sortBy: item.value});currentStep = 0"
      )
        span {{item.name}}
        i.iconfont.u-ml10.u-green(:class="{'icon-checked': item.value === sortBy}")
  el-button.button-dir(
    size="mini"
    @click="updateState({sortDir: !sortDir})"
  )
    i.iconfont.u-s12(
      :class="sortDir ? 'icon-sort-desc' : 'icon-sort-asc'"
    )
  el-button.button-search(
    size="mini"
    circle
    icon="el-icon-search"
    @click="updateState({showSearch: true})"
  )
  el-button.button-add(
    size="mini"
    circle
    icon="el-icon-plus"
    @click="updateState({showTaskAddModal: true})"
  )
</template>

<script>
// import { ipcRenderer } from 'electron'
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex'
import { has } from '~/share/utils'
import { showNativeMessage } from '@/common/utils'

export default {
  data () {
    return {
      has,
      currentStep: 0,
      sortList: [
        { name: this.$t('sort.default'), value: 'default' },
        { name: this.$t('sort.importance'), value: 'importance' },
        { name: this.$t('sort.dueDateTime'), value: 'dueDateTime' },
        { name: this.$t('sort.completed'), value: 'completed' },
        { name: this.$t('sort.letter'), value: 'letter' }
        // { name: this.$t('sort.createDateTime'), value: 'createDateTime' }
      ]
    }
  },

  computed: {
    ...mapState([
      'sortBy',
      'sortDir',
      'showCompleteTask'
    ]),
    ...mapGetters([
      'currentFolder'
    ]),
    dontDelete () {
      const { Id, Name, Key } = this.currentFolder
      return Id && !Key && !has(['任务', 'Task', 'task'], Name)
    },
    sortText () {
      return this.sortList.find(o => o.value === this.sortBy).name
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    ...mapActions({
      deleteFolder: 'DELETE_FOLDER'
    }),
    renameTaskFolder () {
      this.updateState({
        isCreateFolder: false,
        showTaskFolderAddModal: true
      })
    },
    async deleteTaskFolder () {
      const { response } = await showNativeMessage(
        `${this.$t('message.confirmDeleteFolder')}「 ${this.currentFolder.Name} 」？`
      )
      if (!response) {
        try {
          await this.deleteFolder()
          this.$message.success('删除成功')
        } catch (err) {
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-options
  display flex
  align-items stretch
  button
    font-size 14px
    color var(--text-main)
    background var(--background-section)
    border none !important

.task-options__title
  display flex
  align-items center
  padding 0 10px
  justify-content center
  position relative
  i
    position absolute
    left 10px
    font-weight bold
    cursor pointer
  h1
    font-size $size-text-medium
    text-align center
    color var(--text-main)

.task-options__list
  color var(--text-main)
  > div
    display flex
    padding 10px 12px
    user-select none
  .u-form__row
    border-radius 0 !important
    cursor pointer
    background var(--background-content)
    border-color var(--background-section)
    &.delete
      color $red

.task-options__sort
  .u-form__row
    border-radius 0 !important
    background var(--background-content)
    border-color var(--background-section)
    padding 0 12px
    cursor pointer

.button-more
  border-radius 5px 0 0 5px
  padding 5px 5px 5px 10px

.button-sort
  padding 5px
  border-radius 0
  margin 0 -1px

.button-dir
  border-radius 0 5px 5px 0
  padding 5px 10px 5px 5px

.button-search
  border-radius 5px 0 0 5px
  padding 5px 5px 5px 10px

.button-add
  margin-left 0
  border-radius 0 5px 5px 0
  padding 5px 10px 5px 5px

.steps
  height 200px !important
</style>
