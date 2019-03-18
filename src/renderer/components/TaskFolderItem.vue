<template lang="pug">
div.task-folder-item(
  :class="{active: currentFolder.Id === data.Id}"
  @click="updateState({currentFolder: data})"
) {{data.Name}}
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapState({
      currentFolder: ({global}) => global.currentFolder
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
.task-folder-item
  height 36px
  line-height 36px
  font-size 14px
  border-radius 5px
  padding 0 10px
  cursor pointer
  user-select none
  color white
  &.active
    // color #097BED
    // font-weight bold
    // background rgba(#097BED, .1)
    background rgba(black, .15)
</style>
