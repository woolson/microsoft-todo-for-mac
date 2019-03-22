<template lang="pug">
div.header
  div.header__left
    slot(name="left")
  div.header__content
    slot
  div.header__right
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
  padding 12px 15px
  box-shadow 0 0 5px rgba(black, .1)
  user-select none

.header__left
.header__right
  flex 1
  display flex
  align-items center

.header__left
  justify-content flex-start

.header__right
  justify-content flex-end

.header__content
  flex 2
  font-size 18px
  flex-shrink 0
  text-align center
  color $text
  outline none
</style>

