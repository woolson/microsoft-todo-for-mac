import store from '../store/index'
import router from './router'
import i18n from '../common/i18n'
import { Message } from 'element-ui'
import { ipcRenderer } from 'electron'
import { getStoreValue } from './utils'

export default function () {
  const { dispatch, commit, state } = store
  // ESC dismiss modal
  window.addEventListener('keydown', evt => {
    switch (evt.keyCode) {
      // Enter display detail
      case 13:
        if (!state.currentTaskId && !state.showTaskAddModal && !state.showTaskFolderAddModal) {
          commit('UPDATE_STATE', { showTaskDetailModal: true })
        }
        break
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
      isCreateFolder: true,
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
    if (getStoreValue('showCalendarView', true)) {
      if (router.currentRoute.fullPath === '/setting') {
        router.push('/')
      } else {
        router.push('/setting')
      }
    } else {
      commit('UPDATE_STATE', {
        showSettingsModal: !store.state.showSettingsModal
      })
    }
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
  // Toggle complete
  ipcRenderer.on('toggle-complete', async () => {
    const { showCompleteTask } = store.state
    commit('UPDATE_STATE', {showCompleteTask: !showCompleteTask})
  })
}

// Move current folder
function nextFolder (dir) {
  const { currentFolder } = store.getters
  const folders = store.getters.folders.filter(o => o.Key !== 'Spacer')
  if (!folders.length) return
  const index = folders.findIndex(o => {
    return (o.Key === currentFolder.Key && o.Key) || (o.Id === currentFolder.Id && o.Id)
  })
  const nextIndex = index + dir

  if (nextIndex < 0 || nextIndex === folders.length) {
    store.commit('UPDATE_STATE', {
      currentFolderId: folders[dir < 0 ? folders.length - 1 : 0].Id
    })
  } else {
    store.commit('UPDATE_STATE', {
      currentFolderId: folders[nextIndex].Id
    })
  }
}

// Move current task
export function nextTask (dir, tasks) {
  const { currentTaskId, showSearch } = store.state
  const taskList = showSearch ? tasks : store.getters.tasks
  if (!taskList.length) return
  const index = taskList.findIndex(o => o.Id === currentTaskId)
  const nextIndex = index + dir

  if (nextIndex < 0 || nextIndex === taskList.length) {
    store.commit('UPDATE_STATE', {
      currentTaskId: taskList[dir < 0 ? taskList.length - 1 : 0].Id
    })
  } else {
    store.commit('UPDATE_STATE', {
      currentTaskId: taskList[nextIndex].Id
    })
  }
}
