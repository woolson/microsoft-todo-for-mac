import Vue from 'vue'
import Vuex from 'vuex'
import global from './global'

Vue.use(Vuex)

export default new Vuex.Store({
  ...global,
  strict: process.env.NODE_ENV !== 'production'
})
