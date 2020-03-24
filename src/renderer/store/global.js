import { separate, playCompleteVoice, getStoreValue } from '@/common/utils'
import { Storage } from '~/share/utils'
import { get, patch, common } from '@/common/fetch'
import i18n from '@/common/i18n'
import moment from 'moment'
import Vue from 'vue'
import merge from 'deepmerge'
import { PAGE_SIZE } from '@/common/static'

// Get user token from localStorage
const token = new Storage('TOKEN')

const state = {
  // currentFolder: {},
  // currentTask: {},
  isCreateFolder: false,
  currentFolderId: getStoreValue('lastOpenFolder'),
  currentTaskId: getStoreValue('lastOpenFolder'),
  shouldLogin: false,
  shouldLogout: false,
  theme: getStoreValue('theme'),
  language: getStoreValue('language'),
  playAlertVoice: getStoreValue('playAlertVoice', true),
  alertVoicevolume: getStoreValue('alertVoicevolume', 100),
  // show calendar view
  showCalendarView: getStoreValue('showCalendarView', true),
  showCompleteTask: getStoreValue('showCompleteTask', true),
  // display importance folder on sidebar
  showImportanceFolder: getStoreValue('showImportanceFolder', true),
  // display schedule folder on sidebar
  showPlannedFolder: getStoreValue('showPlannedFolder', true),
  // display global task search
  showSearch: false,
  showSettingsModal: false,
  showTaskAddModal: false,
  showTaskDetailModal: false,
  showTaskFolderAddModal: false,
  // sort tasks
  sortBy: 'default',
  // sort direction
  sortDir: true,
  sortStash: getStoreValue('sortStash', {}),
  taskFolders: [],
  tasks: [],
  // get token from localstorage
  token: token.get({}),
  clipboard: '',
  clipboardAs: '',
  showClipboardTip: false
}

const getters = {
  // Get folders by setting of planned & importance
  folders ({tasks, taskFolders, showPlannedFolder, showImportanceFolder}) {
    const folders = [...taskFolders]
    if (showPlannedFolder || showImportanceFolder) {
      folders.unshift({ Key: 'Spacer' })
    }
    const index = folders.findIndex(item => '任务Task'.includes(item.Name))
    if (index !== -1) {
      const taskFolder = folders[index]
      folders.splice(index, 1)
      folders.unshift(taskFolder)
    }
    if (showPlannedFolder) {
      folders.unshift({
        Name: i18n.t('base.planned'),
        Key: 'IsReminderOn',
        Value: true,
        Id: 'IsReminderOn'
      })
    }
    if (showImportanceFolder) {
      folders.unshift({
        Name: i18n.t('base.importance'),
        Key: 'Importance',
        Value: 'High',
        Id: 'Importance'
      })
    }
    return folders
  },
  // Get tasks filtered by folder
  tasks ({sortBy, currentFolderId, sortDir, tasks, showCompleteTask}) {
    let taskArr = [...tasks]
    switch (sortBy) {
      case 'importance':
        taskArr = separate(taskArr, item => item.Importance === 'High')
        break
      case 'dueDateTime':
        taskArr = separate(taskArr, item => !!item.DueDateTime)
        taskArr = taskArr.sort((a, b) => {
          return a.DueDateTime && b.DueDateTime
            ? moment(a.DueDateTime.DateTime).isAfter(moment(b.DueDateTime.DateTime)) ? 1 : -1
            : 1
        })
        break
      case 'completed':
        taskArr = separate(taskArr, item => item.Status === 'Completed')
        break
      case 'letter':
        taskArr = taskArr.sort((a, b) => a.Subject.localeCompare(b.Subject, 'zh'))
        break
      case 'createDateTime':
      default:
        break
    }
    if (!sortDir) taskArr = taskArr.reverse()
    if (currentFolderId === 'Importance') {
      taskArr = taskArr.filter(o => o['Importance'] === 'High')
    } else if (currentFolderId === 'IsReminderOn') {
      taskArr = taskArr.filter(o => o['IsReminderOn'] === true)
    } else {
      taskArr = taskArr.filter(o => o.ParentFolderId === currentFolderId)
    }
    if (!showCompleteTask) {
      taskArr = taskArr.filter(o => o.Status !== 'Completed')
    }
    return taskArr
  },
  currentFolder ({currentFolderId}, {folders}) {
    return folders.find(o => o.Id === currentFolderId) || {}
  },
  currentTask ({tasks, currentTaskId}) {
    return tasks.find(o => o.Id === currentTaskId) || {}
  }
}

const mutations = {
  UPDATE_STATE (state, data) {
    if (data.token) token.set(data.token)
    if (data.currentFolderId) {
      data = merge(data, state.sortStash[data.currentFolderId] || {
        sortBy: 'default',
        sortDir: false,
        showCompleteTask: true
      })
    }
    Object.assign(state, data)
  },
  UPDATE_TASK (state, data) {
    const index = state.tasks.findIndex(o => o.Id === data.Id)
    if (index !== -1) Vue.set(state.tasks, index, {...state.tasks[index], ...data})
  }
}

const actions = {
  // Get use photo - error
  async GET_USER_PHOTO ({commit}) {
    const { value } = await get('/me/photo')
    console.log(value)
  },

  // Get all task folders
  async GET_TASK_FOLDERS ({state, commit}) {
    const newState = {}
    const { value } = await get(`/me/taskfolders?$top=${PAGE_SIZE}`, null, {showLoading: false})
    newState.taskFolders = value
    commit('UPDATE_STATE', newState)
  },

  // Delete folder
  async DELETE_FOLDER ({state, commit}) {
    await common('DELETE', `/me/taskfolders/${state.currentFolderId}`)
    const taskFolders = [...state.taskFolders]
    const taskIndex = state.taskFolders.findIndex(o => o.Id === state.currentFolderId)
    taskFolders.splice(taskIndex, 1)
    commit('UPDATE_STATE', {
      taskFolders,
      currentFolderId: taskFolders[taskIndex - 1].Id
    })
  },

  // Get all user tasks
  async GET_TASKS ({commit}) {
    const { value } = await get(`/me/tasks?$top=${PAGE_SIZE}`, null, {showLoading: false})
    commit('UPDATE_STATE', {tasks: value})
  },

  // Update task, data is Object contain some property of task, Id is required
  async UPDATE_TASK ({state, commit}, data) {
    const newTask = await patch(`/me/tasks/${data.Id}`, data)
    const newState = {tasks: [...state.tasks]}
    const taskIndex = state.tasks.findIndex(o => o.Id === data.Id)

    // play voice
    if (data.Status === 'Completed' && state.playAlertVoice) {
      playCompleteVoice(state.alertVoicevolume)
    }

    newState.tasks[taskIndex] = newTask
    newState.currentTaskId = newTask.Id
    commit('UPDATE_STATE', newState)
  },

  // Delete task
  async DELETE_TASK ({state, commit}) {
    await common('DELETE', `/me/tasks/${state.currentTaskId}`)
    const tasks = [...state.tasks]
    const index = tasks.findIndex(o => o.Id === state.currentTaskId)
    tasks.splice(index, 1)
    commit('UPDATE_STATE', {
      showTaskDetailModal: false,
      tasks,
      currentTaskId: null
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
