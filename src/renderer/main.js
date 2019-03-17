import Vue from 'vue'
import ElementUI from 'element-ui'
import Mousetrap from 'mousetrap'
import './assets/font/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'

import App from './App'
import store from './store'
import './common/fetch'
// import DB from './common/db'
import './common/filter'
import './common/directive'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small' })

Mousetrap.bind('command+,', () => {
  window.vm.$router.push('/setting')
})

// Vue.prototype.$db = DB
/* eslint-disable no-new */
window.vm = new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
