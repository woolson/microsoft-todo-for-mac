import { isEmpty, dater } from '~/share/utils'

export default class Notification {
  constructor () {
    this.tasks = []
    this.remindList = []
  }

  create (tasks) {
    // Clear all timer
    if (!isEmpty(this.remindList)) this.clear()
    // Filter tasks
    this.tasks = tasks.filter(task => {
      const { IsReminderOn, ReminderDateTime, Status } = task
      const taskTime = dater((ReminderDateTime || {}).DateTime).format('x')
      return IsReminderOn && ReminderDateTime && Status !== 'Completed' && taskTime > new Date().getTime()
    })
    // Set timer
    this.remindList = this.tasks.map(task => {
      const timestamp = new Date().getTime()
      const countdown = dater(task.ReminderDateTime.DateTime).format('x') - timestamp
      return setTimeout(() => this.pushNotify(task), countdown)
    })
  }

  // Push notification
  pushNotify ({ Subject, Body }) {
    new window.Notification(Subject, { // eslint-disable-line
      body: Body.Content
    })
  }

  // Clear all notify
  clear () {
    if (!isEmpty(this.remindList)) {
      this.remindList.forEach(item => {
        window.clearTimeout(item)
      })
    }
  }
}
