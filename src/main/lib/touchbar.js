import { TouchBar, nativeImage } from 'electron'
import store from './store'
import language from './language'
// import { readFileSync } from 'fs'
import { join } from 'path'
const { TouchBarButton, TouchBarSpacer } = TouchBar

let cacheOptions = {}
/** Touchbar Icons */
let Icons

/**
 * 文件路径转原生图片
 * @param {string} path 静态文件路径
 */
function pathToNativeImg (path) {
  return nativeImage.createFromPath(join(__static, path))
}

export default function setTouchBar (mainWindow, options) {
  if (!Icons) {
    Icons = {
      viewDisable: pathToNativeImg('/image/view-disable.png'),
      view: pathToNativeImg('/image/view.png'),
      completed: pathToNativeImg('/image/completed.png'),
      uncompleted: pathToNativeImg('/image/uncompleted.png'),
      importance: pathToNativeImg('/image/importance.png'),
      unimportance: pathToNativeImg('/image/unimportance.png'),
      delete: pathToNativeImg('/image/delete.png')
    }
  }

  if (options === void 0) {
    options = cacheOptions
  }
  const Lang = language[store.get('language')]

  cacheOptions = options
  const newFolder = new TouchBarButton({
    label: Lang.createFolder,
    click () {
      mainWindow.webContents.send('new-folder')
    }
  })
  const newTask = new TouchBarButton({
    label: Lang.createTask,
    click () {
      mainWindow.webContents.send('new-task')
    }
  })
  const showComplete = new TouchBarButton({
    icon: options.showCompleteTask
      ? Icons.view
      : Icons.viewDisable,
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
      ? Icons.uncompleted
      : Icons.completed,
    click () {
      mainWindow.webContents.send('complete-task')
    }
  })
  const importance = new TouchBarButton({
    icon: options.Importance === 'High'
      ? Icons.importance
      : Icons.unimportance,
    click () {
      mainWindow.webContents.send('importance-task')
    }
  })
  const deleteTask = new TouchBarButton({
    icon: Icons.delete,
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
