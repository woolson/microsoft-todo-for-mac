import axios from 'axios'
import { AUTH_SCOPE, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '@/common/static'
// import { post } from '@/common/fetch'

export function fileToBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = evt => {
      const base64 = evt.target.result
      resolve(base64)
    }
  })
}

// 深拷贝
export function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 包含关系
 * @param {any} obj 数据源
 * @param {any} values 判断目标
 * @param {string} key obj为对象数组用
 */
export function has (obj, values, options = {}) {
  let valueType = typer(values)
  const arrayFunc = options.strict ? 'every' : 'some'

  switch (typer(obj)) {
    case 'object':
      return valueType === 'string'
        ? obj.hasOwnProperty(values)
        : values[arrayFunc](o => obj.hasOwnProperty(o))
    case 'array':
      if (options.key) {
        return obj.some(o => valueType === 'array'
          ? has(values, o[options.key], options)
          : o[options.key] === values
        )
      } else {
        return valueType === 'array'
          ? values[arrayFunc](o => obj.indexOf(o) !== -1)
          : obj.indexOf(values) !== -1
      }
    case 'string':
      return valueType === 'array'
        ? values[arrayFunc](o => obj.indexOf(o) !== -1)
        : obj.indexOf(values) !== -1
    default:
      return false
  }
}

/**
 * 获取数据类型
 * @example typer(null) // => 'null'
 * @param {any} value 需要获取类型的数据
 */
export function typer (value) {
  let type = Object.prototype.toString.call(value)
  return type.slice(8, -1).toLowerCase()
}

export function parseURL (url) {
  const result = {}
  const [host, query] = url.split('?')
  const queryArray = query.split('&')

  result.host = host
  queryArray.forEach(item => {
    const [key, value] = item.split('=')
    result[key] = value
  })

  return result
}

export function objToForm (obj) {
  return Object.entries(obj).map(o => o.join('=')).join('&')
}

// 新建storage对象
export class Storage {
  constructor (name) {
    this.name = name
  }

  get (defaultValue = {}) {
    const storageStr = window.localStorage.getItem(this.name)
    try {
      return JSON.parse(storageStr) || defaultValue
    } catch (err) {
      console.error('[Storage]', err)
      return defaultValue
    }
  }

  set (value) {
    try {
      window.localStorage.setItem(this.name, JSON.stringify(value))
    } catch (err) {
      console.error('[Storage]', err)
    }
  }

  remove () {
    window.localStorage.removeItem(this.name)
  }
}

/**
 * 日期扩展类
 * @example new Dater()
 */
export class Dater {
  /**
   * 构造器
   * @param {string|number|undefined} value 初始化时间
   */
  constructor (value) {
    this.rawDate = value ? new Date(value) : new Date()
  }

  get year () {
    return this.rawDate.getFullYear()
  }

  get month () {
    return this.rawDate.getMonth()
  }

  get date () {
    return this.rawDate.getDate()
  }

  get hour () {
    return this.rawDate.getHours()
  }

  get minute () {
    return this.rawDate.getMinutes()
  }

  get second () {
    return this.rawDate.getSeconds()
  }

  get timestamp () {
    return this.rawDate.getTime()
  }

  /**
   * 日期操作[加]
   * @example new Dater().add(10, 'date')今天加10天
   * @param {number} value 添加数字
   * @param {string} level 等级
   */
  add (value, level) {
    let copyTime = this.timestamp
    let func = `set${firstUpper(level)}`
    let newDate = new Dater(this.rawDate[func](this[level] + value))
    this.rawDate.setTime(copyTime)
    return newDate
  }

  /**
   * 日期操作[减]
   * @param {number} value 减去level
   * @param {string} level 等级
   */
  subtract (value, level) {
    let copyTime = this.timestamp
    let func = `set${firstUpper(level)}`
    let newDate = new Dater(this.rawDate[func](this[level] + value * -1))
    this.rawDate.setTime(copyTime)
    return newDate
  }

  /**
   * 日期差
   * @param {string|number|date} date 对比日期
   */
  diff (date, level) {
    let thisDate = this.timestamp
    let compare = date instanceof Dater
      ? date.timestamp
      : new Date(date).getTime()

    return formatSecond((thisDate - compare) / 1000, level)
  }

  /**
   * 日期格式化
   * @example {string} 'YYYY-MM-DD HH:mm:SS'
   * @param {string} template 日期输出格式
   * [年] YYYY-2018 YY-18
   * [月] MM-02 M-2
   * [日] DD-08 D-8
   * [时] HH-02 H-2
   * [分] mm-02 m-2
   * [秒] SS-02 S-2
   * [时间戳] X-1410715640.579 x-1410715640579
   */
  format (template = 'YYYY-MM-DD') {
    let map = {
      'YYYY': this.year,
      'YY': String(this.year).slice(-2),
      'MM': headZero(this.month + 1),
      'M': this.month + 1,
      'DD': headZero(this.date),
      'dd': this.date,
      'HH': headZero(this.hour),
      'H': this.hour,
      'mm': headZero(this.minute),
      'm': this.minute,
      'SS': headZero(this.second),
      'S': this.second,
      'X': parseInt(this.timestamp / 1000),
      'x': this.timestamp
    }

    Object.keys(map).forEach(key => {
      template = template.replace(key, map[key])
    })

    return isNaN(template) ? template : Number(template)
  }
}

/**
 * 日期对象构造器
 * @param {date|string} date 需转日期
 */
export function dater (date) {
  return new Dater(date)
}

/**
 * 是否为空
 * @param {Any} value 判断的数据
 */
export function isEmpty (value) {
  const type = typer(value)

  switch (type) {
    case 'object':
      return Object.keys(value).length === 0
    case 'array':
      return value.length === 0
    case 'number':
      return !isNaN(value)
    case 'set':
      const list = Array.from(value)
      return list.length === 0
    case 'map':
      return value.size === 0
    default:
      return !value
  }
}

/**
 * 首字母大写
 * @example firstUpper('woolson') // => 'Woolson'
 * @param {string} string 需转换的字符串
 */
export function firstUpper (string) {
  return `${string.slice(0, 1).toUpperCase()}${string.slice(1).toLowerCase()}`
}

/**
 * 秒格式化
 * @param {number} value 格式化数据
 * @param {string} level 格式化等级
 * @param {number} fixed 小数位
 */
export function formatSecond (value, level, fixed = 0) {
  let map = {
    'minute': 60,
    'hour': 3600,
    'date': 24 * 3600,
    'week': 7 * 24 * 3600,
    'month': 30 * 24 * 3600,
    'year': 365 * 24 * 3600
  }

  if (!map[level] || isNaN(value)) {
    console.error('[Utils/formatSecound]Error: 输入错误或输出格式错误！')
    return
  }

  return Number(value / map[level]).toFixed(fixed)
}

/**
 * 数字补零
 * @example headZero(1, 2) // => '01'
 * @param {string|number} value 值
 * @param {number} length 转换结果长度
 */
export function headZero (value, length = 2) {
  if (String(value).length > length) {
    console.warn('[Utils/headZero]Warn: 源数据长度大于结果长度！')
  }
  return ('0'.repeat(length) + value).substr(-1 * length)
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
