import { TouchBar } from 'electron'
import store from './store'
import language from './language'

const { TouchBarButton, TouchBarSpacer } = TouchBar
let cacheOptions = {}

export default function setTouchBar (mainWindow, options) {
  if (options === void 0) {
    options = cacheOptions
  }
  const LANG = language[store.get('language')]

  cacheOptions = options
  const newFolder = new TouchBarButton({
    label: LANG.createFolder,
    click () {
      mainWindow.webContents.send('new-folder')
    }
  })
  const newTask = new TouchBarButton({
    label: LANG.createTask,
    click () {
      mainWindow.webContents.send('new-task')
    }
  })
  const showComplete = new TouchBarButton({
    label: options.showCompleteTask
      ? LANG.hideComplete
      : LANG.showComplete,
    backgroundColor: '#1c9fff',
    click () {
      setTouchBar(mainWindow, {
        ...options,
        showCompleteTask: !options.showCompleteTask
      })
      mainWindow.webContents.send('toggle-complete')
    }
  })
  const complete = new TouchBarButton({
    label: options.Status !== 'Completed'
      ? LANG.taskComplete
      : LANG.taskStart,
    backgroundColor: '#3DC550',
    click () {
      mainWindow.webContents.send('complete-task')
    }
  })
  const importance = new TouchBarButton({
    label: options.Importance === 'High'
      ? LANG.taskNormal
      : LANG.taskImportance,
    backgroundColor: '#FBBB4D',
    click () {
      mainWindow.webContents.send('importance-task')
    }
  })
  const deleteTask = new TouchBarButton({
    label: LANG.deleteTask,
    backgroundColor: '#FA6260',
    click () {
      mainWindow.webContents.send('delete-task', options)
    }
  })
  const touchbar = [
    newFolder,
    newTask,
    new TouchBarSpacer({ size: 'large' }),
    showComplete
  ]

  if (options.Id) {
    touchbar.push(...[
      new TouchBarSpacer({ size: 'flexible' }),
      complete,
      importance,
      new TouchBarSpacer({ size: 'flexible' }),
      deleteTask
    ])
  }

  mainWindow.setTouchBar(touchbar)
}
