<template lang="pug">
Model.task-detail(
  v-model="showTaskDetail"
  @cancel="updateState({showTaskDetail: false})"
)
  Steps(v-model="currentStep")
    TaskDetailMain(:step.sync="currentStep")
    TaskDetailRepeat(:step.sync="currentStep")
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import TaskDetailMain from './TaskDetailMain'
import TaskDetailRepeat from './TaskDetailRepeat'

export default {
  data () {
    return {
      currentStep: 0
    }
  },

  components: {
    TaskDetailMain,
    TaskDetailRepeat
  },

  computed: {
    ...mapState({
      showTaskDetail: ({global}) => global.showTaskDetail
    })
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    })
  }
}
</script>

<style lang="stylus" scoped>
// .task-detail
//   padding 20px 10px
</style>

