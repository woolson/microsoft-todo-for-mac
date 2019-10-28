'use strict'

import { app, BrowserWindow, systemPreferences, ipcMain } from 'electron'
import initMessager from './lib/messager'
import setTouchBar from './lib/touchbar'
import setMenu from './lib/menu'
import storeSetting from './lib/store'
import fundebug from 'fundebug-nodejs'

fundebug.apikey = 'd7014f96a99bf969b1a571343679a75b4ac453f4c5cd1496fa63782b2ee3ea6b'

// const setting = storeSetting.get()

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
    width: 650,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    useContentSize: true,
    frame: false,
    show: false,
    titleBarStyle: 'hidden',
    transparent: true,
    // backgroundColor: setting.theme === 'dark' ? '#202124' : 'white',
    resizable: true,
    webPreferences: {
      webSecurity: false,
      experimentalFeatures: true
    }
  })
  // Check for updater
  require('update-electron-app')({
    repo: 'woolson/microsoft-todo-mac',
    updateInterval: '5 minutes',
    logger: require('electron-log')
  })
  // Menu bar
  setMenu(mainWindow)
  // Touch bar
  setTouchBar(mainWindow)
  // Set transprent background
  mainWindow.setVibrancy('light')
  // Load page
  mainWindow.loadURL(winURL)
  // add event
  initMessager(mainWindow)
  // Listen preference for theme
  systemPreferences.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    () => {
      if (storeSetting.get('theme') === 'auto') {
        const isDark = systemPreferences.isDarkMode()
        mainWindow.webContents.send('theme-change', isDark)
      }
    }
  )

  mainWindow.on('closed', () => {
    mainWindow = null
    ipcMain.removeAllListeners()
    // ipcRenderer.removeAllListeners()
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
