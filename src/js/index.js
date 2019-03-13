const { ipcRenderer } = require('electron')

var client = {
  // webview 元素
  $wv: document.querySelector('#wv'),
  $nav: document.querySelector('#nav'),
  // 初始化
  init () {
    this.insertCSS()
    this.bindEvent()
  },
  // 插入CS
  insertCSS () {
    // 插入样式
    this.$wv.addEventListener('did-start-loading', (evt) => {
      wv.insertCSS(`
        .o365sx-navbar {
          -webkit-app-region: drag;
        }
        #FlexBoxLeftRegion,
        #todoHelpBtn,
        .sidebar .sidebar-footer {
          display: none !important;
        }
        body:lang(zh) body {
          font-family: 'PingFangSC-Regular' !important;
        }
        html[dir=ltr] body.dark-theme .leftColumn {
          border-right: 1px solid #2D2D2D !important;
        }
        body.dark-theme .popover-header {
          border-bottom: 1px solid #2D2D2D !important;
        }
        body.dark-theme .o365sx-navbar,
        body.dark-theme .o365header.is-consumer,
        body.dark-theme .o365sx-button {
          background-color: #222222 !important;
          background: #222222 !important;
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
        body.dark-theme .popoverMenuItem:hover,
        body.dark-theme .details,
        body.dark-theme .details .section-item:hover,
        body.dark-theme .step:hover,
        body.dark-theme .detailHeader .detailHeader-title:hover,
        body.dark-theme .o365header .searchToolbar,
        body.dark-theme .o365header .searchToolbar .searchToolbar-icon:hover
        {
          background: #1A1A1A !important;
          color: white !important;
        }
        body.dark-theme .o365header .searchToolbar:hover {
          box-shadow: none !important;
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
        body.dark-theme .sidebar-content .listItem .listItem-title,
        body.dark-theme .listTitle,
        body.dark-theme .button {
          color: white !important;
        }
        body.dark-theme #main .main-background,
        body.dark-theme .addTask,
        body.dark-theme .sidebar,
        body.dark-theme .tasksToolbar,
        body.dark-theme .placeholder,
        body.dark-theme #main.backLayer-visible
        {
          background: #333333 !important;
        }
        body.dark-theme #main .main-background,
        html[dir=ltr] .details {
          border-left: 1px solid #2d2d2d !important;
        }
        body.dark-theme .backgroundLines,
        body.dark-theme .details .detailFooter {
          background: #333333 !important;
          border-top: 1px solid #2d2d2d !important;
        }
        body.dark-theme .taskItem-body,
        body.dark-theme .collapsible-taskCard .taskCard {
          box-shadow: 0 17px 0 -16px #2d2d2d !important;
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
        body.dark-theme .taskItem:hover .taskItem-body,
        body.dark-theme .details .details-separator,
        body.dark-theme .details .detailFooter,
        body.dark-theme .taskCard {
          background: #202020 !important;
          color: white !important;
        }
        body.dark-theme .taskItem-titleWrapper,
        body.dark-theme .taskCard-labels {
          color: #DDD !important;
        }
        body.dark-theme .details .section-item.detailNote,
        body.dark-theme .details .section,
        body.dark-theme .details .detailHeader,
        body.dark-theme .details .details-separator,
        body.dark-theme .steps,
        body.dark-theme .taskCard {
          border: 1px solid #2D2D2D !important;
        }
        body.dark-theme .details .section,
        body.dark-theme .details .detailHeader,
        body.dark-theme .details .steps {
          color: #DDD !important;
          background: #333 !important;
        }
        body.dark-theme .step .step-body {
          box-shadow: 0 1px 0 0 #2D2D2D;
        }
        body.dark-theme .editableContent-edit,
        body.dark-theme .editableContent-display,
        body.dark-theme .editableContent-textarea {
          color: #DDD !important;
        }
      `)
      // 设置主题
      let theme = ipcRenderer.sendSync('fetch-theme')
      this.$nav.style.background = theme === 'dark-theme' ? '#222222' : '#0078D7'
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
      this.$nav.style.background = '#222222'
      this.exec('document.querySelector("body").className = "dark-theme"')
    })
    // 切换亮主题
    ipcRenderer.on('event-light-theme', () => {
      this.$nav.style.background = '#0078D7'
      this.exec('document.querySelector("body").className = ""')
    })
  },
  exec (cmd) {
    this.$wv.executeJavaScript(cmd)
  }
}

client.init()
