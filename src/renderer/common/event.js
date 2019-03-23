import store from '../store/index'
import i18n from '../common/i18n'
import { Message } from 'element-ui'
import { ipcRenderer } from 'electron'

export default function () {
  const { dispatch, commit } = store
  // ESC dismiss modal
  window.addEventListener('keydown', evt => {
    switch (evt.keyCode) {
      // ESC
      case 27:
        commit('UPDATE_STATE', {
          showTaskDetailModal: false,
          showTaskAddModal: false,
          showTaskFolderAddModal: false,
          showSettingsModal: false
        })
        break
      // Previous folder or task
      case 38:
        evt.metaKey ? nextFolder(-1) : nextTask(-1)
        break
      // Next folder or task
      case 40:
        evt.metaKey ? nextFolder(1) : nextTask(1)
        break
    }
  })
  // Shortcut for create folder
  ipcRenderer.on('new-folder', () => {
    commit('UPDATE_STATE', {
      showTaskFolderAddModal: true
    })
  })
  // Shortcut for create task
  ipcRenderer.on('new-task', () => {
    commit('UPDATE_STATE', {
      showTaskAddModal: true
    })
  })
  // Show settings
  ipcRenderer.on('preferences', () => {
    commit('UPDATE_STATE', {
      showSettingsModal: true
    })
  })

  // Global task search
  ipcRenderer.on('search', () => {
    commit('UPDATE_STATE', { showSearch: true })
  })

  // Toggle task completed
  ipcRenderer.on('complete-task', async () => {
    try {
      const { currentTask } = store.state
      await dispatch('UPDATE_TASK', {
        Id: currentTask.Id,
        Status: currentTask.Status === 'Completed' ? 'NotStarted' : 'Completed'
      })
      Message.success(i18n.t('message.updateSuccessfully'))
    } catch (err) {
      console.log(err)
      Message.error(i18n.t('message.updateFailed'))
    }
  })
  // Toggle task importance
  ipcRenderer.on('importance-task', async () => {
    try {
      const { currentTask } = store.state
      await dispatch('UPDATE_TASK', {
        Id: currentTask.Id,
        Importance: currentTask.Importance === 'High' ? 'Normal' : 'High'
      })
      Message.success(i18n.t('message.updateSuccessfully'))
    } catch (err) {
      console.log(err)
      Message.error(i18n.t('message.updateFailed'))
    }
  })
  // Delete task
  ipcRenderer.on('delete-task', async () => {
    try {
      const { currentTask } = store.state
      const result = ipcRenderer.sendSync('delete-task', currentTask)
      if (result) {
        await dispatch('DELETE_TASK')
        Message.success(i18n.t('message.deleteSuccessfully'))
      }
    } catch (err) {
      console.log(err)
      Message.error(i18n.t('message.deleteFailed'))
    }
  })
  // Toggle complete
  ipcRenderer.on('toggle-complete', async () => {
    const { showCompleteTask } = store.state
    commit('UPDATE_STATE', {showCompleteTask: !showCompleteTask})
  })
}

// Move current folder
function nextFolder (dir) {
  const { currentFolder } = store.state
  const folders = store.getters.folders.filter(o => o.Key !== 'Spacer')
  if (!folders.length) return
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

// Move current task
export function nextTask (dir, tasks) {
  const { currentTask, showSearch } = store.state
  const taskList = showSearch ? tasks : store.getters.tasks
  if (!taskList.length) return
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
