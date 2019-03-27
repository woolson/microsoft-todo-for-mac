import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import store from './store'
import i18n from './common/i18n'

import './common/fetch'
import './common/filter'
import './common/directive'
import './assets/font/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'
// import 'animate.css'

// Global Vue components register
const components = require.context('./components/common', false, /\.vue$/)

components.keys().forEach(path => {
  const component = components(path).default
  Vue.component(component.name, component)
})

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' })

// Global JS colors
Vue.prototype.$color = {
  blue: '#1c9fff',
  purple: '#765ee7',
  red: '#FA6260',
  yellow: '#FBBB4D',
  green: '#3DC550',
  gray: '#909399'
}

// Set app language
i18n.locale = store.state.language

/* eslint-disable no-new */
window.vm = new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
