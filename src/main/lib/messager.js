import { dialog, ipcMain, nativeTheme, BrowserView } from 'electron'
import setTouchBar from './touchbar'
import setMenu from './menu'
import language from './language'
import store from './store'
import path from 'path'
import tempPath from 'temp-dir'
import { writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { AUTH_SCOPE, CLIENT_ID, REDIRECT_URI } from '~/share/static'
import { objToForm } from '~/share/utils'

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
    event.returnValue = nativeTheme.shouldUseDarkColors
  })

  // View file content
  ipcMain.on('view-file', (event, arg) => {
    const filePath = path.join(tempPath, arg.Name)
    const fileContent = Buffer.from(arg.ContentBytes, 'base64')
    writeFileSync(filePath, fileContent)
    execSync(`open ${filePath.replace(/\s/, '\\ ')}`)
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

  ipcMain.on('login', (event) => {
    const LOGIN_ORIGIN = 'https://login.microsoftonline.com/common/oauth2/v2.0'
    const query = {
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      response_mode: 'query',
      scope: AUTH_SCOPE,
      state: 12345
    }
    const view = new BrowserView()
    const rect = mainWindow.getBounds()
    mainWindow.setBrowserView(view)
    view.setBounds({
      x: 0,
      y: 0,
      width: rect.width,
      height: rect.height
    })
    view.webContents.loadURL(`${LOGIN_ORIGIN}/authorize?${objToForm(query)}`)
    view.webContents.addEventListener('did-finish-load', () => {
    })
    event.returnValue = true
  })
}
