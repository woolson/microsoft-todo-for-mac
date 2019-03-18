import { Storage } from '@/common/utils'
import { get, patch } from '@/common/fetch'

const token = new Storage('TOKEN')
const BASE_URL = 'https://outlook.office.com/api/v2.0'
const PAGE_SIZE = 100
// const BASE_URL = 'https://graph.microsoft.com/beta'

const state = {
  hasLogin: true,
  token: token.get({}),
  taskFolders: [],
  currentFolder: {},
  sort: false,
  tasks: [],
  currentTask: {},
  showTaskDetail: false
}

const getters = {
  tasks ({sort, tasks, currentFolder}) {
    let taskArr = [...tasks]
    if (!sort) taskArr = [...tasks].reverse()
    if (currentFolder.Key) {
      return taskArr.filter(o => o[currentFolder.Key] === currentFolder.Value)
    } else {
      return taskArr.filter(o => o.ParentFolderId === currentFolder.Id)
    }
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
  async GET_TASK_FOLDERS ({state, commit, dispatch}) {
    const { value } = await get({
      url: `${BASE_URL}/me/taskfolders?$top=${PAGE_SIZE}`,
      options: {
        headers: {
          Authorization: `Bearer ${state.token.access_token}`
        }
      }
    })
    const currentFolder = value.find(o => o.IsDefaultFolder)
    commit('UPDATE_STATE', {taskFolders: value, currentFolder})
    dispatch('GET_TASKS')
  },
  async GET_TASKS ({state, commit}) {
    const { value } = await get({
      url: `${BASE_URL}/me/tasks?$top=${PAGE_SIZE}`,
      options: {
        headers: {
          Authorization: `Bearer ${state.token.access_token}`
        }
      }
    })
    commit('UPDATE_STATE', {tasks: value.reverse()})
  },
  async UPDATE_TASK ({state, commit}, data) {
    const newTask = await patch({
      url: `${BASE_URL}/me/tasks/${data.Id}`,
      data,
      options: {
        headers: {
          Authorization: `Bearer ${state.token.access_token}`
        }
      }
    })
    const newState = {tasks: [...state.tasks]}
    const taskIndex = state.tasks.findIndex(o => o.Id === data.Id)
    newState.tasks[taskIndex] = newTask
    if (state.showTaskDetail) {
      newState.currentTask = newTask
    }
    commit('UPDATE_STATE', newState)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
