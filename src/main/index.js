'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import initMessager from './lib/messager'
import setMenu from './lib/menu'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    useContentSize: true,
    frame: false,
    show: false,
    titleBarStyle: 'hidden',
    // transparent: true,
    resizable: true,
    webPreferences: {
      devTools: true,
      webSecurity: false
    }
  })
  // 菜单栏
  setMenu(mainWindow)

  mainWindow.loadURL(winURL)
  // mainWindow.webContents.openDevTools()

  // 创建窗口后加载事件
  initMessager(app, ipcMain, mainWindow)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
