import language from './language'
import store from './store'

const { Menu, shell } = require('electron')

export default function setMenu (mainWindow) {
  const LANG = language[store.get('language')] || {}
  let template = [
    {
      label: 'Application',
      submenu: [
        { label: LANG.about, role: 'about' },
        { type: 'separator' },
        {
          label: LANG.setting,
          accelerator: 'Command+,',
          click: () => {
            mainWindow.webContents.send('preferences')
          }
        },
        { type: 'separator' },
        { label: LANG.quite, role: 'quit' }
      ]
    },
    {
      label: LANG.window,
      submenu: [
        {
          label: LANG.search,
          accelerator: 'Command+F',
          click: () => mainWindow.webContents.send('search')
        },
        { label: LANG.mini, role: 'minimize' },
        {
          label: LANG.hide,
          accelerator: 'Command+W',
          role: 'hide'
        }
      ]
    },
    {
      label: LANG.edit,
      submenu: [
        {
          label: LANG.createFolder,
          accelerator: 'Command+Shift+N',
          click: () => {
            mainWindow.webContents.send('new-folder')
          }
        },
        {
          label: LANG.createTask,
          accelerator: 'Command+N',
          click: () => {
            mainWindow.webContents.send('new-task')
          }
        },
        { type: 'separator' },
        { label: LANG.undo, role: 'undo' },
        { label: LANG.redo, role: 'redo' },
        { type: 'separator' },
        { label: LANG.cut, role: 'cut' },
        { label: LANG.copy, role: 'copy' },
        { label: LANG.paste, role: 'paste' }
      ]
    },
    {
      label: LANG.development,
      visible: process.env.NODE_ENV === 'development',
      submenu: [
        { label: LANG.devTool, role: 'toggledevtools' }
      ]
    },
    {
      label: LANG.link,
      submenu: [
        {
          label: LANG.projectHome,
          click: () => shell.openExternal('https://woolson.github.io/microsoft-todo-mac/')
        },
        {
          label: LANG.openSource,
          click: () => shell.openExternal('https://github.com/woolson/microsoft-todo-mac')
        },
        {
          label: LANG.issus,
          click: () => shell.openExternal('https://github.com/woolson/microsoft-todo-mac/issues')
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
