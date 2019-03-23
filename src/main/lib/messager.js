import { dialog, ipcMain } from 'electron'
import setTouchBar from './touchbar'
import store from './store'

export default function (mainWindow) {
  // Update touchbar
  ipcMain.on('update-touchbar', (event, arg) => {
    setTouchBar(mainWindow, arg)
  })
  // Delete folder
  ipcMain.on('delete-folder', (event, arg) => {
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['取消', '确认'],
      message: `注意`,
      detail: `确认删除清单 ${arg.Name} ？`
    }, res => (event.returnValue = res))
  })
  // Delete task
  ipcMain.on('delete-task', (event, arg) => {
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['取消', '确认'],
      message: `注意`,
      detail: `确认删除任务 ${arg.Subject} ？`
    }, res => (event.returnValue = res))
  })
  // Fetch setting content
  ipcMain.on('fetch-setting', (event, arg) => {
    event.returnValue = store.get()
  })
  // Update setting content
  ipcMain.on('update-setting', (event, arg) => {
    console.log(arg)
    store.set(arg)
    event.returnValue = true
  })
}
