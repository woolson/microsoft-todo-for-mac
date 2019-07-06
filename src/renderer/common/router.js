import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index.vue'
import Calendar from '../views/Calendar.vue'
import Setting from '../views/Setting.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/calendar',
    component: Calendar
  },
  {
    path: '/setting',
    component: Setting
  }
]

export default new Router({
  routes,
  mode: 'hash'
})
