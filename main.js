// Modules to control application life and create native browser window
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const Config = require('electron-config')
// 设置
const config = new Config()

let theme = config.get('theme') || 'light-theme'
let mainWindow

function createWindow () {
  // 注册菜单
  registerShorcut()
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'To-do',
    titleBarStyle: 'hidden',
    backgroundColor: theme === 'dark-theme' ? '#333333' : '#FFFFFF',
    webPreferences: {
      devTools: false
    }
  })
  mainWindow.loadFile('index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function registerShorcut () {
  let isZh = app.getLocale() === 'zh-CN'
  let template = [
    {
      label: 'Application',
      submenu: [
        {
          label: isZh ? '关于' : 'About',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        {
          label: isZh ? '退出' : 'Quit',
          accelerator: 'Command+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: isZh ? '编辑' : 'Edit',
      submenu: [
        {
          label: isZh ? '新建清单' : 'New List',
          accelerator: 'Command+N',
          click: () => mainWindow.webContents.send('event-new-list')
        },
        {
          label: isZh ? '新建待办事项' : 'New Todo',
          accelerator: 'Command+Shift+N',
          click: () => mainWindow.webContents.send('event-new-todo')
        },
        {
          label: isZh ? '搜索' : 'Search',
          accelerator: 'Command+F',
          click: () => mainWindow.webContents.send('event-search')
        }
      ]
    },
    {
      label: isZh ? '视图' : 'View',
      submenu: [
        {
          label: isZh ? '主题' : 'theme',
          submenu: [
            {
              label: isZh ? '明亮' : 'Light',
              type: 'radio',
              checked: theme === 'light-theme',
              click: () => {
                config.set('theme', 'light-theme')
                mainWindow.webContents.send('event-light-theme')
              }
            },
            {
              label: isZh ? '黑暗' : 'Dark',
              type: 'radio',
              checked: theme === 'dark-theme',
              click: () => {
                config.set('theme', 'dark-theme')
                mainWindow.webContents.send('event-dark-theme')
              }
            }
          ]
        },
        {
          label: isZh ? '刷新' : 'Refresh',
          accelerator: 'Command+R',
          click: () => mainWindow.reload()
        },
        {
          label: isZh ? '关闭' : 'close',
          accelerator: 'command+w',
          click: () => app.hide()
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

ipcMain.on('fetch-theme', (evt) => evt.returnValue = theme)

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
