import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '../i18n/en'
import zh from '../i18n/zh'

Vue.use(VueI18n)

export default new VueI18n({
  messages: { zh, en },
  locale: 'en',
  fallbackLocale: 'en'
})
