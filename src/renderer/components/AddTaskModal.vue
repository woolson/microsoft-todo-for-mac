<template lang="pug">
Modal.add-task(
  v-model="showTaskAddModal"
  @cancel="updateState({showTaskAddModal: false})"
)
  Header
    span {{$t('task.create')}}
    el-button(
      slot="right"
      @click="submit"
      circle
      icon="el-icon-check"
    )
  el-alert(
    :title="$t('message.enterToSubmit')"
    type="info"
    center
    :closable="false"
  )
  div.add-task__content
    div.u-form__row-section
      div.u-form__row
        label.u-w50 {{$t('base.folder')}}
        el-select.u-flex-1.u-mt-5.u-mb-5(v-model="belongFolder")
          el-option(
            v-for="item in taskFolders"
            :key="item.Id"
            :value="item.Id"
            :label="item.Name"
          )
      div.u-form__row
        label.u-w50 {{$t('base.name')}}
        el-input.u-mt-5.u-mb-5(
          ref="input"
          v-model="name"
          :placeholder="$t('task.name')"
          @keyup.enter.native.stop="submit"
          clearable
          autofocus
        )
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'AddFolder',

  data: () => ({
    name: '',
    belongFolder: null
  }),

  computed: {
    ...mapState([
      'tasks',
      'taskFolders',
      'showTaskAddModal'
    ]),
    ...mapGetters([
      'currentFolder'
    ])
  },

  watch: {
    showTaskAddModal (newValue) {
      if (!newValue) {
        this.name = ''
        return
      }
      if (this.currentFolder.Id) {
        this.belongFolder = this.currentFolder.Id
      } else {
        const hasIdFolder = this.taskFolders.find(o => o.Id)
        if (hasIdFolder) this.belongFolder = hasIdFolder.Id
      }
      this.$nextTick(this.$refs.input.focus)
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    async submit () {
      try {
        const newTask = await this.$post(`/me/taskfolders/${this.belongFolder}/tasks`, {
          Subject: this.name
        })
        this.updateState({
          tasks: [...this.tasks, newTask],
          showTaskAddModal: false
        })
        this.$message.success(this.$t('message.createSuccessfully'))
      } catch (err) {
        this.$message.error(this.$t('message.createFailed'))
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.model__main
  display flex
  flex-direction column
  height 100vh

.add-task__content
  flex 1
  padding 12px 0
  display flex
  flex-direction column
  align-items stretch
</style>
