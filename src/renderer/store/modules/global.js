import { Storage } from '@/common/utils'
import { get } from '@/common/fetch'

const token = new Storage('TOKEN')
const BASE_URL = 'https://graph.microsoft.com/beta'

const state = {
  hasLogin: true,
  token: token.get({}),
  taskFolders: [],
  currentFolder: {},
  sort: false,
  tasks: [],
  currentTask: {},
  currentTaskDetail: {},
  showTaskDetail: false
}

const getters = {
  tasks ({sort, tasks}) {
    if (sort) return tasks
    else return [...tasks].reverse()
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
  async GET_TASK_FOLDERS ({state, commit}) {
    const { value } = await get({
      url: `${BASE_URL}/me/outlook/taskFolders`,
      options: {
        headers: {
          Authorization: `Bearer ${state.token.access_token}`
        }
      }
    })
    const currentFolder = value.find(o => o.isDefaultFolder)
    commit('UPDATE_STATE', {taskFolders: value, currentFolder})
  },
  async GET_TASKS ({state, commit}) {
    const { id } = state.currentFolder
    const { value } = await get({
      url: `${BASE_URL}/me/outlook/taskFolders/${id}/tasks`,
      options: {
        headers: {
          Authorization: `Bearer ${state.token.access_token}`
        }
      }
    })
    commit('UPDATE_STATE', {tasks: value.reverse()})
  }
  // async GET_TASK_DETAIL ({state, commit}) {
  //   const { id } = state.currentTask
  //   const { value } = await get({
  //     url: `${BASE_URL}/me/outlook/tasks/${id}`,
  //     options: {
  //       headers: {
  //         Authorization: `Bearer ${state.token.access_token}`
  //       }
  //     }
  //   })
  //   commit('UPDATE_STATE', {
  //     currentTaskDetail: value,
  //     showTaskDetail: true
  //   })
  // }
}

export default {
  state,
  mutations,
  actions,
  getters
}
