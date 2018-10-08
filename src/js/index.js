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
      wv.insertCSS(`
        #sidebar,
        .tasksToolbar {
            -webkit-app-region: drag;
        }
        #sidebar {
          padding-top: 20px;
        }
        #sidebar .sidebar-footer {
          display: none !important;
        }
        body:lang(zh) body {
          font-family: 'PingFangSC-Regular' !important;
        }
        body.dark-theme .todayToolbar.active,
        body.dark-theme .todayToolbar-item.active,
        body.dark-theme .todayToolbar-item.active .todayToolbar-inner
        {
          background: #1A1A1A !important;
        	color: white !important;
        }
        body.dark-theme .listItem.active,
        body.dark-theme .taskItem:hover .taskItem-body,
        body.dark-theme .todayToolbar:hover,
        body.dark-theme .todayToolbar-item:hover,
        body.dark-theme .listItem:hover,
        body.dark-theme .addList:hover,
        body.dark-theme .addList:active:hover,
        body.dark-theme .addList:hover,
        body.dark-theme .userToolbar:hover,
        body.dark-theme .searchToolbar:hover,
        body.dark-theme .taskItem.selected .taskItem-body,
        body.dark-theme .popoverMenuItem:hover
        {
          background: #1A1A1A !important;
          color: white !important;
        }
        body.dark-theme .taskItem.selected .taskItem-body,
        body.dark-theme .taskItem:hover .taskItem-body
        {
          box-shadow: none;
        }
        body.dark-theme .addTask {
          box-shadow: 0 1px 0 -6px #2d2d2d, 3px -4px 0 -3px #2d2d2d !important;
        }
        body.dark-theme .todayToolbar-title,
        body.dark-theme .userToolbar-name,
        body.dark-theme .taskItem-titleWrapper,
        body.dark-theme .addTask .addTask-input,
        body.dark-theme .sidebar-inner .listItem .listItem-title {
        	color: white !important;
        }
        body.dark-theme #main .main-background,
        body.dark-theme .addTask,
        body.dark-theme #sidebar
        {
        	background: #333333 !important;
        }
        body.dark-theme #main .main-background {
        	border-left: 1px solid #2d2d2d !important;
        }
        body.dark-theme .backgroundLines {
        	background: #333333 !important;
        	border-top: 1px solid #2d2d2d !important;
        }
        body.dark-theme .popover {
          background: #393939 !important;
        }
        body.dark-theme .popoverMenuItem .popoverMenuItem-label,
        body.dark-theme .popover-header,
        body.dark-theme .popover-footer,
        body.dark-theme .popover-headerLeft,
        body.dark-theme .popover-footerRight {
          color: white !important;
        }
        body.dark-theme .modal-sharing {
          background: #333 !important;
          color: white !important;
        }
        body.dark-theme .themeComposition.big {
          background: #333 !important;
        }
        body.dark-theme .themePicker-headline {
          color: white !important;
        }
        body.dark-theme .tasksToolbar .tasksToolbar-actions .tasksToolbar-actionsItem .button {
          background: #2E2E2E !important;
        }
        body.dark-theme .taskCard {
          background: #222 !important;
        }
        body.dark-theme .taskItem:hover .taskItem-body {
          background: #202020 !important;
          color: white !important;
        }
        body.dark-theme .taskItem-titleWrapper,
        body.dark-theme .taskCard-labels {
          color: #DDD !important;
        }
      `)
      // 设置主题
      let theme = ipcRenderer.sendSync('fetch-theme')
      wv.executeJavaScript(`document.querySelector("body").className = "${theme}"`)
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
    // 切换暗主题
    ipcRenderer.on('event-dark-theme', () => {
      this.exec('document.querySelector("body").className = "dark-theme"')
    })
    // 切换亮主题
    ipcRenderer.on('event-light-theme', () => {
      this.exec('document.querySelector("body").className = ""')
    })
  },
  exec (cmd) {
    this.$wv.executeJavaScript(cmd)
  }
}

client.init()
