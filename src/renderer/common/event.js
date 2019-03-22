import store from '../store/index'
import { Message } from 'element-ui'
import { ipcRenderer } from 'electron'

export default function () {
  const { dispatch, commit } = store
  // ESC 关闭弹窗
  window.addEventListener('keydown', evt => {
    switch (evt.keyCode) {
      // ESC
      case 27:
        commit('UPDATE_STATE', {
          showTaskDetailModel: false,
          showTaskAddModel: false,
          showTaskFolderAddModel: false,
          showSettingsModel: false
        })
        break
      // 上一个清单
      case 38:
        evt.metaKey ? nextFolder(-1) : nextTask(-1)
        break
      // 下一个清单
      case 40:
        evt.metaKey ? nextFolder(1) : nextTask(1)
        break
    }
  })
  // 新建任务夹
  ipcRenderer.on('new-folder', () => {
    commit('UPDATE_STATE', {
      showTaskFolderAddModel: true
    })
  })
  // 新建任务
  ipcRenderer.on('new-task', () => {
    commit('UPDATE_STATE', {
      showTaskAddModel: true
    })
  })
  // 显示偏好设置
  ipcRenderer.on('preferences', () => {
    commit('UPDATE_STATE', {
      showSettingsModel: true
    })
  })

  // 搜索
  ipcRenderer.on('search', () => {
    commit('UPDATE_STATE', { showSearch: true })
  })

  // 完成任务
  ipcRenderer.on('complete-task', async () => {
    try {
      const { currentTask } = store.state.global
      await dispatch('UPDATE_TASK', {
        Id: currentTask.Id,
        Status: currentTask.Status === 'Completed' ? 'NotStarted' : 'Completed'
      })
      Message.success('更新成功')
    } catch (err) {
      console.log(err)
      Message.error('更新失败')
    }
  })
  // 重要任务
  ipcRenderer.on('importance-task', async () => {
    try {
      const { currentTask } = store.state.global
      await dispatch('UPDATE_TASK', {
        Id: currentTask.Id,
        Importance: currentTask.Importance === 'High' ? 'Normal' : 'High'
      })
      Message.success('更新成功')
    } catch (err) {
      console.log(err)
      Message.error('更新失败')
    }
  })
  // 删除任务
  ipcRenderer.on('delete-task', async () => {
    try {
      const { currentTask } = store.state.global
      const result = ipcRenderer.sendSync('delete-task', currentTask)
      if (result) {
        await dispatch('DELETE_TASK')
        Message.success('删除成功')
      }
    } catch (err) {
      console.log(err)
      Message.error('删除失败')
    }
  })
  ipcRenderer.on('toggle-complete', async () => {
    const { showCompleteTask } = store.state.global
    commit('UPDATE_STATE', {showCompleteTask: !showCompleteTask})
  })
}

// 调整当前清单
function nextFolder (dir) {
  const { currentFolder } = store.state.global
  const folders = store.getters.folders.filter(o => o.Key !== 'Spacer')
  const index = folders.findIndex(o => {
    return (o.Key === currentFolder.Key && o.Key) || (o.Id === currentFolder.Id && o.Id)
  })
  const nextIndex = index + dir

  if (nextIndex < 0 || nextIndex === folders.length) {
    store.commit('UPDATE_STATE', {
      currentFolder: folders[dir < 0 ? folders.length - 1 : 0]
    })
  } else {
    store.commit('UPDATE_STATE', {
      currentFolder: folders[nextIndex]
    })
  }
}

// 调整当前任务
export function nextTask (dir, tasks) {
  const { currentTask, showSearch } = store.state.global
  const taskList = showSearch ? tasks : store.getters.tasks
  const index = taskList.findIndex(o => o.Id === currentTask.Id)
  const nextIndex = index + dir

  if (nextIndex < 0 || nextIndex === taskList.length) {
    store.commit('UPDATE_STATE', {
      currentTask: taskList[dir < 0 ? taskList.length - 1 : 0]
    })
  } else {
    store.commit('UPDATE_STATE', {
      currentTask: taskList[nextIndex]
    })
  }
}
