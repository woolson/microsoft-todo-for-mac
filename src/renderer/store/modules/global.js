import { Storage } from '@/common/utils'
import { get, patch, common } from '@/common/fetch'
import i18n from '@/common/i18n'

const token = new Storage('TOKEN')
const PAGE_SIZE = 100
// const BASE_URL = 'https://graph.microsoft.com/beta'

const state = {
  userPhoto: null,
  hasLogin: true,
  // get token from localstorage
  token: token.get({}),
  taskFolders: [],
  currentFolder: {},
  // sort tasks
  sort: false,
  tasks: [],
  currentTask: {},
  // display global task search
  showSearch: false,
  showCompleteTask: true,
  showTaskDetailModal: false,
  showTaskAddModal: false,
  showTaskFolderAddModal: false,
  showSettingsModal: false,
  // display importance folder on sidebar
  showImportanceFolder: true,
  // display schedule folder on sidebar
  showScheduleFolder: true
}

const getters = {
  // Get folders by setting of planned & importance
  folders ({taskFolders, showScheduleFolder, showImportanceFolder}) {
    const folders = [...taskFolders]
    if (showScheduleFolder || showImportanceFolder) {
      folders.unshift({ Key: 'Spacer' })
    }
    if (showScheduleFolder) {
      folders.unshift({ Name: i18n.t('base.planned'), Key: 'IsReminderOn', Value: true })
    }
    if (showImportanceFolder) {
      folders.unshift({ Name: i18n.t('base.importance'), Key: 'Importance', Value: 'High' })
    }
    return folders
  },
  // Get tasks filtered by folder
  tasks ({sort, tasks, currentFolder, showCompleteTask}) {
    let taskArr = [...tasks]
    if (!sort) taskArr = [...tasks].reverse()
    if (currentFolder.Key) {
      taskArr = taskArr.filter(o => o[currentFolder.Key] === currentFolder.Value)
    } else {
      taskArr = taskArr.filter(o => o.ParentFolderId === currentFolder.Id)
    }
    if (!showCompleteTask) {
      taskArr = taskArr.filter(o => o.Status !== 'Completed')
    }
    return taskArr
  }
}

const mutations = {
  UPDATE_STATE (state, data) {
    if (data.token) {
      token.set(data.token)
    }
    Object.assign(state, data)
  }
}

const actions = {
  // Get use photo - error
  async GET_USER_PHOTO ({commit}) {
    const { value } = await get('/me/photo')
    console.log(value)
  },
  // Get all task folders
  async GET_TASK_FOLDERS ({commit}) {
    const { value } = await get(`/me/taskfolders?$top=${PAGE_SIZE}`, null, {showLoading: false})
    const currentFolder = value.find(o => o.IsDefaultFolder)
    commit('UPDATE_STATE', {taskFolders: value, currentFolder})
  },
  // Delete folder
  async DELETE_FOLDER ({state, commit}) {
    await common('DELETE', `/me/taskfolders/${state.currentFolder.Id}`)
    const taskFolders = [...state.taskFolders]
    const taskIndex = state.taskFolders.findIndex(o => o.Id === state.currentFolder.Id)
    taskFolders.splice(taskIndex, 1)
    commit('UPDATE_STATE', {taskFolders, currentFolder: taskFolders[taskIndex - 1]})
  },
  // Get all user tasks
  async GET_TASKS ({commit}) {
    const { value } = await get(`/me/tasks?$top=${PAGE_SIZE}`, null, {showLoading: false})
    commit('UPDATE_STATE', {tasks: value.reverse()})
  },
  // Update task, data is Object contain some property of task, Id is required
  async UPDATE_TASK ({state, commit}, data) {
    const newTask = await patch(`/me/tasks/${data.Id}`, data)
    const newState = {tasks: [...state.tasks]}
    const taskIndex = state.tasks.findIndex(o => o.Id === data.Id)
    newState.tasks[taskIndex] = newTask
    newState.currentTask = newTask
    commit('UPDATE_STATE', newState)
  },
  // Delete task
  async DELETE_TASK ({state, commit}) {
    await common('DELETE', `/me/tasks/${state.currentTask.Id}`)
    const tasks = [...state.tasks]
    const index = tasks.findIndex(o => o.Id === state.currentTask.Id)
    tasks.splice(index, 1)
    commit('UPDATE_STATE', {
      showTaskDetailModal: false,
      tasks,
      currentTask: {}
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
