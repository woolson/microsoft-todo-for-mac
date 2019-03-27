import Vue from 'vue'
import moment from 'moment'

Vue.filter('date', (value, temp, valueTemp) => {
  return moment(value, valueTemp).format(temp)
})
