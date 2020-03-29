import { ipcMain, nativeTheme } from 'electron'
import setTouchBar from './touchbar'
import setMenu from './menu'
import store from './store'
import path from 'path'
import tempPath from 'temp-dir'
import { writeFileSync } from 'fs'

export default function (mainWindow) {
  // Update touchbar
  ipcMain.on('update-touchbar', (event, arg) => {
    setTouchBar(mainWindow, arg)
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
    event.returnValue = nativeTheme.shouldUseDarkColors
  })

  // View file content
  ipcMain.on('view-file', (event, arg) => {
    const filePath = path.join(tempPath, arg.Name)
    const fileContent = Buffer.from(arg.ContentBytes, 'base64')
    writeFileSync(filePath, fileContent)
    mainWindow.previewFile(filePath, arg.Name)
    event.returnValue = true
  })

  // Save file content
  ipcMain.on('save-file', (event, arg) => {
    const fileContent = Buffer.from(arg.file.ContentBytes, 'base64')
    writeFileSync(arg.filename, fileContent)
    event.returnValue = true
  })

  ipcMain.on('clear-session', (event) => {
    // console.dir()
    mainWindow.webContents.session.clearStorageData({
      origin: 'https://login.microsoftonline.com'
    })
    event.returnValue = true
  })
}
