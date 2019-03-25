export default {
  base: {
    async: 'Async',
    at: 'At',
    cancel: 'Cancel',
    check: 'Check',
    completed: 'Completed',
    create: 'Create',
    delete: 'Delete',
    due: 'Due',
    edit: 'Edit',
    empty: 'Empty',
    failed: 'Failed',
    folder: 'Folder',
    hide: 'Hide',
    importance: 'Importance',
    language: 'Language',
    loading: 'Loading',
    logout: 'Logout',
    me: 'Me',
    name: 'Name',
    note: 'Note',
    period: 'Period',
    planned: 'Planned',
    remind: 'Remind',
    rename: 'Rename',
    repeat: 'Repeat',
    select: 'Select',
    setting: 'Setting',
    show: 'Show',
    sort: 'Sort',
    submit: 'Submit',
    successfully: 'Successfully',
    task: 'Task',
    time: 'Time',
    update: 'Update',
    theme: 'Theme',
    auto: 'Auto',
    downloading: 'Downloading'
  },
  date: {
    custom: 'Custom',
    daily: 'Daily',
    day: 'Day',
    firday: 'Fri',
    monday: 'Mon',
    month: 'Month',
    monthly: 'Monthly',
    saturday: 'Sat',
    sunday: 'Sun',
    thurday: 'Thur',
    tuesday: 'Tues',
    wednesday: 'Wed',
    week: 'Week',
    weekDays: 'WeekDays',
    weekly: 'Weekly',
    year: 'Year',
    yearly: 'Yearly'
  },
  folder: {
    create: '@:base.create @:base.folder',
    createFolder: '{0} @:base.folder',
    empty: '@:base.empty @:base.folder',
    name: '@:base.folder @:base.name'
  },
  message: {
    commonFailed: '{0} @:base.failed',
    commonSuccessfully: '{0} @:base.successfully',
    createFailed: '@:base.create @:base.failed',
    createSuccessfully: '@:base.create @:base.successfully',
    deleteFailed: '@:base.delete @:base.failed',
    deleteSuccessfully: '@:base.delete @:base.successfully',
    enterToSubmit: 'Press Enter to Submit.',
    updateFailed: '@:base.update @:base.failed',
    updateSuccessfully: '@:base.update @:base.successfully'
  },
  task: {
    completeAt: '@:base.completed @:base.at',
    create: '@:base.create @:base.task',
    createAt: '@:base.create @:base.at',
    delete: '@:base.delete @:base.task',
    dueTime: '@:base.due @:base.time',
    name: '@:base.task @:base.name',
    remindTime: '@:base.remind @:base.time',
    showCompleted: '@:base.show @:base.completed',
    showImportance: '@:base.show @:base.importance',
    showPlanned: '@:base.show @:base.planned'
  },
  setting: {
    lightTheme: 'Light',
    darkTheme: 'Dark',
    selectTheme: '@:base.select @:base.theme',
    quiteInstall: 'Quite & Install',
    checkFailed: '@:base.check@:base.failed',
    checkVersion: 'Version'
  }
}
