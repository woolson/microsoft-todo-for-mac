import { dialog, ipcMain, systemPreferences } from 'electron'
import setTouchBar from './touchbar'
import setMenu from './menu'
import language from './language'
import store from './store'
import path from 'path'
import tempPath from 'temp-dir'
import { writeFileSync } from 'fs'
import { execSync } from 'child_process'

export default function (mainWindow) {
  // Update touchbar
  ipcMain.on('update-touchbar', (event, arg) => {
    setTouchBar(mainWindow, arg)
  })

  // Delete folder
  ipcMain.on('delete-folder', (event, arg) => {
    const LANG = language[store.get('language')]
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: [LANG.cancel, LANG.submit],
      message: LANG.notice,
      detail: `${LANG.confirmDeleteFolder} ${arg.Name} ？`
    }, res => (event.returnValue = res))
  })

  // Delete task
  ipcMain.on('delete-task', (event, arg) => {
    const LANG = language[store.get('language')]
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: [LANG.cancel, LANG.submit],
      message: LANG.notice,
      detail: `${LANG.confirmDeleteTask} ${arg.Subject} ？`
    }, res => (event.returnValue = res))
  })

  // Fetch setting content
  ipcMain.on('fetch-setting', (event, arg) => {
    event.returnValue = store.get()
  })

  // Update setting content
  ipcMain.on('update-setting', (event, arg) => {
    store.set(arg)
    if (arg['language']) {
      setMenu(mainWindow)
      setTouchBar(mainWindow)
    }
    event.returnValue = true
  })

  // Get system theme
  ipcMain.on('get-theme', (event, arg) => {
    event.returnValue = systemPreferences.isDarkMode()
  })

  // View file content
  ipcMain.on('view-file', (event, arg) => {
    const filePath = path.join(tempPath, arg.Name)
    const fileContent = Buffer.from(arg.ContentBytes, 'base64')
    writeFileSync(filePath, fileContent)
    execSync(`open ${filePath}`)
    event.returnValue = true
  })
}
