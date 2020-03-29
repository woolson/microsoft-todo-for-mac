import axios from 'axios'
import { objToForm, dater } from '~/share/utils'
import { AUTH_SCOPE, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '~/share/static'
import { ipcRenderer, remote } from 'electron'
import i18n from './i18n'

// Get setting from store
export function getStoreValue (key, defaultValue) {
  const storeSetting = ipcRenderer.sendSync('fetch-setting')
  if (storeSetting[key] === void 0) {
    return defaultValue
  } else {
    return storeSetting[key]
  }
}

export function refreshToken (refreshToken) {
  return new Promise((resolve, reject) => {
    const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    const queryObj = {
      client_id: CLIENT_ID,
      scope: AUTH_SCOPE,
      refresh_token: refreshToken,
      redirect_uri: REDIRECT_URI,
      grant_type: 'refresh_token',
      client_secret: CLIENT_SECRET
    }

    axios.post(url, objToForm(queryObj), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      if (res.refresh_token) res.refresh_token = refreshToken
      res.expires_time = dater().format('X') + res.expires_in
      resolve(res)
    }).catch(reject)
  })
}

export function separate (array, adjustFun) {
  const ahead = []
  const behind = []

  for (let item of array) {
    if (adjustFun(item)) ahead.push(item)
    else behind.push(item)
  }
  return [...ahead, ...behind]
}

export function playCompleteVoice (volume) {
  const $audio = document.createElement('audio')
  $audio.src = require('@/assets/audio/completed.m4r')
  $audio.volume = volume / 100
  $audio.play()
}

export function changeTheme (theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'theme-dark')
  } else if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'theme-light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function showNativeMessage (message) {
  return remote.dialog.showMessageBox(remote.getCurrentWindow(), {
    type: 'question',
    icon: remote.nativeImage.createFromDataURL(require('@/assets/image/warning.png')),
    buttons: [i18n.t('base.submit'), i18n.t('base.cancel')],
    defaultId: 0,
    message: i18n.t('base.notice'),
    detail: message
  })
}
