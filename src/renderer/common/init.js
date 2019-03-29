import Vue from 'vue'
import ElementUI from 'element-ui'
import '../assets/font/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
Vue.config.productionTip = false

// Global Vue components register
const components = require.context('../components/common', false, /\.vue$/)
components.keys().forEach(path => {
  const component = components(path).default
  Vue.component(component.name, component)
})

// Global JS colors
Vue.prototype.$color = {
  blue: '#1c9fff',
  purple: '#765ee7',
  red: '#FA6260',
  yellow: '#FBBB4D',
  green: '#3DC550',
  gray: '#909399'
}

Vue.use(ElementUI, { size: 'small' })
