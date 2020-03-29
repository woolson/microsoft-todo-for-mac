import { TouchBar, nativeImage } from 'electron'
import store from './store'
import language from './language'

const { TouchBarButton, TouchBarSpacer } = TouchBar
let cacheOptions = {}
/** Touchbar Icons */
const ICONS = {
  viewDisable: nativeImage.createFromPath('static/image/view-disable.png'),
  view: nativeImage.createFromPath('static/image/view.png'),
  completed: nativeImage.createFromPath('static/image/completed.png'),
  uncompleted: nativeImage.createFromPath('static/image/uncompleted.png'),
  importance: nativeImage.createFromPath('static/image/importance.png'),
  unimportance: nativeImage.createFromPath('static/image/unimportance.png'),
  delete: nativeImage.createFromPath('static/image/delete.png')
}

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
    icon: options.showCompleteTask
      ? ICONS.viewDisable
      : ICONS.view,
    click () {
      setTouchBar(mainWindow, {
        ...options,
        showCompleteTask: !options.showCompleteTask
      })
      mainWindow.webContents.send('toggle-complete')
    }
  })
  const complete = new TouchBarButton({
    icon: options.Status !== 'Completed'
      ? ICONS.uncompleted
      : ICONS.completed,
    click () {
      mainWindow.webContents.send('complete-task')
    }
  })
  const importance = new TouchBarButton({
    icon: options.Importance === 'High'
      ? ICONS.importance
      : ICONS.unimportance,
    click () {
      mainWindow.webContents.send('importance-task')
    }
  })
  const deleteTask = new TouchBarButton({
    icon: ICONS.delete,
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
      new TouchBarSpacer({ size: 'large' }),
      complete,
      importance,
      deleteTask
    ])
  }

  mainWindow.setTouchBar(new TouchBar({items: touchbar}))
}
