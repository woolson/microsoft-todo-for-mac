import Vue from 'vue'
import { has } from '@/common/utils'

Vue.directive('toggle-class', {
  componentUpdated: updateClass,
  bind: updateClass
})

function updateClass (el, binding, vnode) {
  let klass = vnode.data.attrs['toggle-class']
  if (binding.value) {
    if (has(el.className, klass)) {
      el.className = el.className.replace(` ${klass[1]}`, ` ${klass[0]}`)
    } else {
      el.className += ` ${klass[0]}`
    }
  } else {
    el.className = el.className.replace(` ${klass[0]}`, ` ${klass[1]}`)
  }
}
