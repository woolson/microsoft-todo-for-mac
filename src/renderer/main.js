import Vue from 'vue'
import App from './App'
import store from './store'
import i18n from './common/i18n'

// Load package and config
import './common/init'
// Load fetch plugin
import './common/fetch'
// Load vue filters
import './common/filter'
// Load vue directives
import './common/directive'

// Set app language
i18n.locale = store.state.language

/* eslint-disable no-new */
window.vm = new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
