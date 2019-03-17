// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {
  Carousel,
  CarouselItem
} from 'element-ui'

import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/style.styl'
import '@/assets/slider/slider.min.css'

Vue.config.productionTip = false

Vue.component(Carousel.name, Carousel)
Vue.component(CarouselItem.name, CarouselItem)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
