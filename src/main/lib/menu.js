const { Menu, app, shell } = require('electron')

export default function setMenu (mainWindow) {
  let isZh = app.getLocale() === 'zh-CN'
  let template = [
    {
      label: 'Application',
      submenu: [
        {
          label: isZh ? '关于' : 'About',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: isZh ? '偏好设置' : 'Preferences',
          accelerator: 'Command+,',
          click: () => {
            mainWindow.webContents.send('preferences')
          }
        },
        { type: 'separator' },
        {
          label: isZh ? '退出' : 'Quit',
          role: 'quit'
        }
      ]
    },
    {
      label: isZh ? '窗口' : 'Window',
      submenu: [
        {
          label: isZh ? '搜索' : 'Search',
          accelerator: 'Command+F',
          click: () => mainWindow.webContents.send('search')
        },
        // {
        //   label: isZh ? '刷新' : 'Refresh',
        //   accelerator: 'Command+R',
        //   click: () => mainWindow.reload()
        // },
        {
          label: isZh ? '关闭' : 'Close',
          role: 'close'
        },
        {
          label: isZh ? '最小化' : 'Minimize',
          role: 'minimize'
        },
        {
          label: isZh ? '隐藏' : 'Hide',
          role: 'hide'
        }
      ]
    },
    {
      label: isZh ? '编辑' : 'Edit',
      submenu: [
        {
          label: isZh ? '新建清单' : 'New Folder',
          accelerator: 'Command+Shift+N',
          click: () => {
            mainWindow.webContents.send('new-folder')
          }
        },
        {
          label: isZh ? '新建任务' : 'New Task',
          accelerator: 'Command+N',
          click: () => {
            mainWindow.webContents.send('new-task')
          }
        },
        { type: 'separator' },
        { label: isZh ? '撤销' : 'UnDo', role: 'undo' },
        { label: isZh ? '重做' : 'ReDo', role: 'redo' },
        { type: 'separator' },
        { label: isZh ? '剪切' : 'Cut', role: 'cut' },
        { label: isZh ? '复制' : 'Copy', role: 'copy' },
        { label: isZh ? '粘贴' : 'Paste', role: 'paste' }
      ]
    },
    {
      label: isZh ? '开发' : 'Development',
      submenu: [
        { label: isZh ? '调试控制台' : 'ToggleDevTools', role: 'toggledevtools' }
      ]
    },
    {
      label: isZh ? '关于' : 'About',
      submenu: [
        {
          label: isZh ? '项目主页' : 'Project Home',
          click: () => shell.openExternal('https://woolson.github.io/ms-todo/')
        },
        {
          label: isZh ? '开源主页(小星星)' : 'Open Source (Welcome Star)',
          click: () => shell.openExternal('https://github.com/woolson/ms-todo')
        },
        {
          label: isZh ? '有问题' : 'Project Issus',
          click: () => shell.openExternal('https://github.com/woolson/ms-todo/issues')
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
