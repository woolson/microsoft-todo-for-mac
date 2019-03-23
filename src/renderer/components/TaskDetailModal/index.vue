<template lang="pug">
Modal.task-detail(
  v-model="showTaskDetailModal"
  @cancel="updateState({showTaskDetailModal: false});currentStep = 0"
)
  Steps(v-model="currentStep")
    Main(:step.sync="currentStep")
    Repeat(:step.sync="currentStep")
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Main from './Main'
import Repeat from './Repeat'

export default {
  data () {
    return {
      currentStep: 0
    }
  },

  components: {
    Main,
    Repeat
  },

  computed: {
    ...mapState({
      showTaskDetailModal: ({global}) => global.showTaskDetailModal
    })
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    })
  }
}
</script>
