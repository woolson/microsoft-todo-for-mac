import { app } from 'electron'
import path from 'path'
import { readFileSync, writeFileSync } from 'fs'

export class Store {
  constructor (options) {
    this.options = options
    this.filePath = path.join(__dirname, options.file)
  }

  get (key) {
    let result
    try {
      result = {
        ...this.options.default,
        ...JSON.parse(readFileSync(this.filePath) || '{}')
      }
    } catch (err) {
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
    language: app.getLocale() === 'zh-CN' ? 'zh' : 'en'
  }
})
