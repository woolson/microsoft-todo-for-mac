<template lang="pug">
Modal.settings(
  v-model="showSettingsModal"
  @cancel="updateState({showSettingsModal: false})"
)
  SettingContent
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import SettingContent from './SettingContent.vue'

export default {
  components: {
    SettingContent
  },

  computed: {
    ...mapState([
      'showSettingsModal'
    ])
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    })
  }
}
</script>
