// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
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
    backgroundColor: '#FFFFFF',
    webPreferences: {
      devTools: true
    }
  })
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
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
          label: isZh ? '刷新' : 'Refresh',
          accelerator: 'Command+R',
          click: () => mainWindow.reload()
        },
        {
          label: isZh ? '关闭' : 'Close',
          accelerator: 'Command+W',
          click: () => app.hide()
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
