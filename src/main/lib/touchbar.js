import { TouchBar, app } from 'electron'
// import { isEmpty } from '@/common/utils'

const { TouchBarButton, TouchBarSpacer } = TouchBar

export default function setTouchBar (mainWindow, options = {}) {
  const isZh = app.getLocale() === 'zh-CN'
  const newFolder = new TouchBarButton({
    label: isZh ? '新建清单' : 'New Folder',
    // backgroundColor: '#1c9fff',
    click () {
      mainWindow.webContents.send('new-folder')
    }
  })
  const newTask = new TouchBarButton({
    label: isZh ? '新建任务' : 'New Task',
    // backgroundColor: '#765ee7',
    click () {
      mainWindow.webContents.send('new-task')
    }
  })
  const showComplete = new TouchBarButton({
    label: options.showCompleteTask
      ? isZh ? '隐藏已完成' : 'Hide Complete'
      : isZh ? '显示已完成' : 'Show Complete',
    backgroundColor: '#1c9fff',
    click () {
      setTouchBar(mainWindow, {
        ...options,
        showCompleteTask: !options.showCompleteTask
      })
      mainWindow.webContents.send('toggle-complete')
    }
  })
  const complete = new TouchBarButton({
    label: options.Status !== 'Completed'
      ? isZh ? '任务完成' : 'Completed'
      : isZh ? '任务开始' : 'Start',
    backgroundColor: '#3DC550',
    click () {
      mainWindow.webContents.send('complete-task')
    }
  })
  const importance = new TouchBarButton({
    label: options.Importance === 'High'
      ? isZh ? '设为普通' : 'Normal'
      : isZh ? '设为重要' : 'Importance',
    backgroundColor: '#FBBB4D',
    click () {
      mainWindow.webContents.send('importance-task')
    }
  })
  const deleteTask = new TouchBarButton({
    label: isZh ? '删除任务' : 'Delete Task',
    backgroundColor: '#FA6260',
    click () {
      mainWindow.webContents.send('delete-task', options)
    }
  })
  const touchbar = [
    newFolder,
    newTask,
    new TouchBarSpacer({ size: 'large' }),
    showComplete
  ]

  if (options.Id) {
    touchbar.push(...[
      new TouchBarSpacer({ size: 'large' }),
      complete,
      importance,
      new TouchBarSpacer({ size: 'large' }),
      deleteTask
    ])
  }

  mainWindow.setTouchBar(touchbar)
}
