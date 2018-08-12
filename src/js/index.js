const { ipcRenderer } = require('electron')

var client = {
  // webview 元素
  $wv: document.querySelector('#wv'),
  // 初始化
  init () {
    this.insertCSS()
    this.bindEvent()
  },
  // 插入CSS
  insertCSS () {
    // 插入样式
    this.$wv.addEventListener('did-finish-load', (evt) => {
      document.body.className = ''
      wv.insertCSS(`
        #sidebar,.tasksToolbar {
          -webkit-app-region: drag;
        }
        #sidebar {
          padding-top: 20px;
        }
        #sidebar .sidebar-footer {
          display: none !important;
        }
        html:lang(zh) body {
          font-family: 'PingFangSC-Regular' !important;
        }
      `)
    })
  },
  bindEvent () {
    // 搜索
    ipcRenderer.on('event-search', () => {
      this.exec('document.querySelector("button.search").click()')
    })
    // 新建清单
    ipcRenderer.on('event-new-list', () => {
      this.exec('document.querySelector("button.addList").click()')
    })
    // 新建待办事项
    ipcRenderer.on('event-new-todo', () => {
      this.exec('document.querySelector("#addTaskInput").focus()')
    })
  },
  exec (cmd) {
    this.$wv.executeJavaScript(cmd)
  }
}

client.init()
