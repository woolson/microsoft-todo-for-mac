import { app } from 'electron'
import path from 'path'
import fundebug from 'fundebug-nodejs'
import { readFileSync, writeFileSync, existsSync } from 'fs'

export class Store {
  constructor (options) {
    this.options = options
    this.filePath = path.join(app.getPath('userData'), options.file)
    // Create file if setting.json does not exist
    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, JSON.stringify(options.default))
    }
  }

  get (key) {
    let result
    try {
      result = {
        ...this.options.default,
        ...JSON.parse(readFileSync(this.filePath) || '{}')
      }
    } catch (err) {
      fundebug.notifyError(err)
      result = {}
    }
    return key ? result[key] : result
  }

  set (newValue) {
    const allValue = { ...this.get(), ...newValue }
    writeFileSync(this.filePath, JSON.stringify(allValue))
  }
}

export default new Store({
  file: './settings.json',
  default: {
    // Use system language for default
    language: app.getLocale() === 'zh-CN' ? 'zh' : 'en',
    // Use auto for default thema
    theme: 'auto'
  }
})
