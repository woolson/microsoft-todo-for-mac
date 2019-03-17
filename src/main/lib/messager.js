// import moment from 'moment'
// import db from './db'

// const DATE_TEMP = 'YYYY-MM-DD HH:mm:SS'

export default function (app, ipc, mainWindow) {
  // 退出软件
  ipc.on('quite', (event, arg) => {
    // 网口信息
    app.quit()
    event.returnValue = 'ok'
  })
  // 最小化软件
  ipc.on('mini', (event, arg) => {
    // 网口信息
    mainWindow.minimize()
    event.returnValue = 'ok'
  })

  // 获取历史数据
  // ipc.on('get-history', (event, arg) => {
  //   db.find({}, (err, docs) => {
  //     if (err) event.returnValue = []
  //     else event.returnValue = docs
  //   })
  //   // event.returnValue = JSON.parse(fs.readFileSync(HISTORY_FILE))
  // })

  // 保存历史
  // ipc.on('insert-history', (event, arg) => {
  //   const docs = arg.map(item => {
  //     return {
  //       imageUrl: item.imageUrl,
  //       success: item.success,
  //       name: item.name,
  //       date: moment().format(DATE_TEMP)
  //     }
  //   })

  //   db.insert(docs, (err, result) => (event.returnValue = !!err))
  // })

  // 保存历史
  // ipc.on('clear-history', (event, arg) => {
  //   db.remove({}, { multi: true }, (err, numRemoved) => {
  //     if (err) event.returnValue = false
  //     else event.returnValue = numRemoved
  //   })
  // })
}
