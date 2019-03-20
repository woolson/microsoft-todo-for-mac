import Vue from 'vue'
import ElementUI from 'element-ui'
import './assets/font/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'

import App from './App'
import store from './store'
import './common/fetch'
import './common/filter'
import './common/directive'

// 全局注册组件
const components = require.context('./components/common', false, /\.vue$/)

components.keys().forEach(path => {
  const component = components(path).default
  Vue.component(component.name, component)
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' })

/* eslint-disable no-new */
window.vm = new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
