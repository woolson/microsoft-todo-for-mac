<template lang="pug">
div.header
  div.header__left(v-show="$slots.left")
    slot(name="left")
  div.header__content
    slot
  div.header__right(v-show="$slots.right")
    slot(name="right")
</template>

<script>
export default {
  name: 'Header'
}
</script>


<style lang="stylus" scoped>
.header
  display flex
  align-items center
  padding 5px 15px
  user-select none
  height 50px
  box-sizing border-box

.header__left
.header__right
  flex 1
  display flex
  align-items center
  white-space nowrap

.header__left
  justify-content flex-start
  white-space nowrap

.header__right
  justify-content flex-end

.header__content
  flex 2
  flex-grow 10
  display flex
  justify-content center
  font-size 18px
  flex-shrink 0
  text-align center
  color var(--text-main)
  outline none
</style>

