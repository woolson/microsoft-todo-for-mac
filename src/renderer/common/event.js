import store from '../store/index'
import { ipcRenderer } from 'electron'

export default function () {
  // ESC 关闭弹窗
  window.addEventListener('keydown', evt => {
    switch (evt.keyCode) {
      // ESC
      case 27:
        store.commit('UPDATE_STATE', {
          showTaskDetailModel: false,
          showTaskAddModel: false,
          showTaskFolderAddModel: false,
          showSettingsModel: false
        })
        break
      // 上一个清单
      case 38:
        nextFolder(-1)
        break
      // 下一个清单
      case 40:
        nextFolder(1)
        break
    }
  })
  // 新建任务夹
  ipcRenderer.on('new-folder', () => {
    store.commit('UPDATE_STATE', {
      showTaskFolderAddModel: true
    })
  })
  // 新建任务
  ipcRenderer.on('new-task', () => {
    store.commit('UPDATE_STATE', {
      showTaskAddModel: true
    })
  })
  // 显示偏好设置
  ipcRenderer.on('preferences', () => {
    store.commit('UPDATE_STATE', {
      showSettingsModel: true
    })
  })
}

// 调整当前清单
function nextFolder (dir) {
  const { taskFolders, currentFolder } = store.state.global
  const index = taskFolders.findIndex(o => o.Id === currentFolder.Id)
  const nextIndex = index + dir

  if (nextIndex < 0 || nextIndex === taskFolders.length) {
    store.commit('UPDATE_STATE', {
      currentFolder: taskFolders[dir < 0 ? taskFolders.length - 1 : 0]
    })
  } else {
    store.commit('UPDATE_STATE', {
      currentFolder: taskFolders[index + dir]
    })
  }
}
