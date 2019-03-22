import { dialog } from 'electron'
import setTouchBar from './touchbar'

export default function (app, ipc, mainWindow) {
  // 退出软件
  ipc.on('quite', (event, arg) => {
    // 网口信息
    app.quit()
    event.returnValue = 'ok'
  })
  // 最小化软件
  ipc.on('mini', (event, arg) => {
    // 网口信息
    mainWindow.minimize()
    event.returnValue = 'ok'
  })
  // 更新touchbar
  ipc.on('update-touchbar', (event, arg) => {
    setTouchBar(mainWindow, arg)
  })
  // 删除清单
  ipc.on('delete-folder', (event, arg) => {
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['取消', '确认'],
      message: `注意`,
      detail: `确认删除清单 ${arg.Name} ？`
    }, res => (event.returnValue = res))
  })
  // 删除任务
  ipc.on('delete-task', (event, arg) => {
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['取消', '确认'],
      message: `注意`,
      detail: `确认删除任务 ${arg.Subject} ？`
    }, res => (event.returnValue = res))
  })
}
