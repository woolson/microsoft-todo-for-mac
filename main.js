// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let template = [
  {
    label: "Application",
    submenu: [
      { label: "About", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: () => app.quit() }
    ]
  }, {
    label: 'View',
    submenu: [
			{ label: "Refresh", accelerator: "Command+R", click: () => mainWindow.reload() },
      { label: "Close", accelerator: "Command+W", click: () => app.hide() },
    ]
  }
]

function createWindow () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

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

  // globalShortcut.register('Cmd+w', () => {
  //   mainWindow.close()
  // })
  // globalShortcut.register('Cmd+m', () => {
  //   mainWindow.minimize()
  // })

  // let titleView = new BrowserView({
  //   webPreferences: {
  //     nodeIntegration: false
  //   }
  // })
  // let view = new BrowserView({
  //   webPreferences: {
  //     nodeIntegration: false
  //   }
  // })
  // mainWindow.setBrowserView(view)
  // view.setBounds({ x: 0, y: 0, width: 800, height: 580 })
  // view.setAutoResize({width: true, height: true})
  // view.setBackgroundColor('#FFFFFF')
  // view.webContents.loadURL('https://to-do.microsoft.com/')
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // mainWindow.loadURL('https://to-do.microsoft.com/')

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
