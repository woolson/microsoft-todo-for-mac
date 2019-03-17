'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import initMessager from './lib/messager'

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
  // setMenu()
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    useContentSize: true,
    frame: false,
    titleBarStyle: 'hidden',
    // transparent: true,
    resizable: true,
    webPreferences: {
      devTools: true,
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)
  // mainWindow.webContents.openDevTools()

  // 创建窗口后加载事件
  initMessager(app, ipcMain, mainWindow)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// function setMenu () {
//   let isZh = app.getLocale() === 'zh-CN'
//   let template = [
//     {
//       label: 'Application',
//       submenu: [
//         {
//           label: isZh ? '关于' : 'About',
//           selector: 'orderFrontStandardAboutPanel:'
//         },
//         { type: 'separator' },
//         {
//           label: isZh ? '退出' : 'Quit',
//           accelerator: 'Command+Q',
//           click: () => app.quit()
//         }
//       ]
//     },
//     {
//       label: isZh ? '视图' : 'View',
//       submenu: [
//         {
//           label: isZh ? '刷新' : 'Refresh',
//           accelerator: 'Command+R',
//           click: () => mainWindow.reload()
//         },
//         {
//           label: isZh ? '隐藏' : 'Hide',
//           accelerator: 'command+w',
//           click: () => app.hide()
//         }
//       ]
//     },
//     {
//       label: isZh ? '编辑' : 'Edit',
//       submenu: [
//         {
//           label: isZh ? '粘贴' : 'Paste',
//           accelerator: 'Command+V',
//           click: () => {
//             console.log(123)
//             mainWindow.webContents.send('onPaste', clipboard.readImage().toDataURL())
//           }
//         }
//       ]
//     }
//   ]
//   Menu.setApplicationMenu(Menu.buildFromTemplate(template))
// }

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
