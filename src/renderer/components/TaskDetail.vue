<template lang="pug">
Model.task-detail(
  v-model="showTaskDetail"
  @cancel="updateState({showTaskDetail: false, currentTask: null})"
)
  Steps(v-model="currentStep")
    TaskDetailMain(:step.sync="currentStep")
    TaskDetailRepeat(:step.sync="currentStep")
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Steps from './Steps'
import Model from './Model'
import TaskDetailMain from './TaskDetailMain'
import TaskDetailRepeat from './TaskDetailRepeat'

export default {
  data () {
    return {
      currentStep: 0
    }
  },

  components: {
    Steps,
    Model,
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

