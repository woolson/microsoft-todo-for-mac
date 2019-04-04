<div align="center">
  <a src="https://woolson.github.io/microsoft-todo-for-mac/" target="_blank">
    <img src="build/icons/icon.png" width="240" />
  </a>
</div>

<h1 align="center">Microsoft ToDo</h1>

<div align="center">
<a href="https://woolson.github.io/npmer-page/">
<img src="https://woolson.gitee.io/npmer-badge/dark%20mode-555555-supported-44cc11-gear-ffffff-square-flat-plain.svg" />
<img src="https://woolson.gitee.io/npmer-badge/touchbar-555555-supported-46bc99-check-ffffff-square-flat-plain.svg" />
<img src="https://woolson.gitee.io/npmer-badge/version-555555-2.0.1-7289da-square-flat-plain.svg" />
</a>
</div>

> 背景：想找个云端多设备支持（mac/ios）的todo软件。iOS的AppStore上发现微软出品的ToDo不错，但是没有macOS端，所以自己动手做了一个。

喜欢就点个赞吧，谢谢！！！

[EN Docs](./README.md)

- 基于 [Electron](https://electronjs.org/) & [Electron Vue](https://simulatedgreg.gitbooks.io/electron-vue/)
- 微软 [Outlook Task API](https://docs.microsoft.com/en-us/previous-versions/office/office-365-api/api/version-2.0/task-rest-operations)

## 截图

![home](./website/src/assets/etc-10.png)
![dark-home](./website/src/assets/etc-08.png)

[更多信息查看](https://woolson.github.io/microsoft-todo-mac/)

## 特性/TODO

- Microsoft To-Do macOS客户端
- 原生APP的体验
- 清新易用的界面
  - 界面显示
  - 搜索
  - 清单
  - 任务
  - 设置
- 支持快捷键操作
  - 新建清单 (Cmd + Shift + N)
  - 选择清单 (Cmd + ↑/↓)
  - 新建任务 (Cmd + N)
  - 选择任务 (↑/↓)
  - 搜索/取消搜索 (Cmd + F/ESC)
  - 偏好设置 (Cmd + ,)
- 支持TouchBar操作
  - 新建清单
  - 新建任务
  - 隐藏/显示已完成任务
  - 完成/开始任务
  - 重要/取消重要
  - 删除任务
- 中英文支持
- 暗黑模式（支持macOS 10.14 Mojave的系统设置，其他系统版本可手动设置）✔︎
- 在线升级
- 提示信息

## TODO

- 获取时区(目前为上海)
- 任务重复功能支持
- 附件下载支持
