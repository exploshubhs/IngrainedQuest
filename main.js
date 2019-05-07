// // const electron = require('electron')
// // // Module to control application life.
// // const app = electron.app
// // // Module to create native browser window.
// // const BrowserWindow = electron.BrowserWindow

// // const path = require('path')
// // const url = require('url')

// // // Keep a global reference of the window object, if you don't, the window will
// // // be closed automatically when the JavaScript object is garbage collected.
// // let mainWindow

// // function createWindow () {
// //   // Create the browser window.
// //   mainWindow = new BrowserWindow({width: 800, height: 600})

// //   // and load the index.html of the app.
// //   mainWindow.loadURL(url.format({
// //     pathname: path.join(__dirname, 'index.html'),
// //     protocol: 'file:',
// //     slashes: true
// //   }))

// //   // Open the DevTools.
// //   // mainWindow.webContents.openDevTools()

// //   // Emitted when the window is closed.
// //   mainWindow.on('closed', function () {
// //     // Dereference the window object, usually you would store windows
// //     // in an array if your app supports multi windows, this is the time
// //     // when you should delete the corresponding element.
// //     mainWindow = null
// //   })
// // }

// // // This method will be called when Electron has finished
// // // initialization and is ready to create browser windows.
// // // Some APIs can only be used after this event occurs.
// // app.on('ready', createWindow)

// // // Quit when all windows are closed.
// // app.on('window-all-closed', function () {
// //   // On OS X it is common for applications and their menu bar
// //   // to stay active until the user quits explicitly with Cmd + Q
// //   if (process.platform !== 'darwin') {
// //     app.quit()
// //   }
// // })

// // app.on('activate', function () {
// //   // On OS X it's common to re-create a window in the app when the
// //   // dock icon is clicked and there are no other windows open.
// //   if (mainWindow === null) {
// //     createWindow()
// //   }
// // })

// // // In this file you can include the rest of your app's specific main process
// // // code. You can also put them in separate files and require them here.
// 'use strict'
// const electron = require('electron')
// const app = electron.app
// const globalShortcut = electron.globalShortcut
// const os = require('os')
// const path = require('path')
// const config = require(path.join(__dirname, 'package.json'))
// const model = require(path.join(__dirname, 'app', 'model.js'))
// const BrowserWindow = electron.BrowserWindow

// app.setName(config.productName)
// var mainWindow = null
// app.on('ready', function () {
//   mainWindow = new BrowserWindow({
//     backgroundColor: 'lightgray',
//     title: config.productName,
//     show: false,
//     webPreferences: {
//       nodeIntegration: false,
//       defaultEncoding: 'UTF-8'
//     }
//   })

//   model.initDb(app.getPath('userData'),
//     // Load a DOM stub here. See renderer.js for the fully composed DOM.
//     mainWindow.loadURL(`file://${__dirname}/app/html/index.html`)
//   )

//   // Enable keyboard shortcuts for Developer Tools on various platforms.
//   let platform = os.platform()
//   if (platform === 'darwin') {
//     globalShortcut.register('Command+Option+I', () => {
//       mainWindow.webContents.openDevTools()
//     })
//   } else if (platform === 'linux' || platform === 'win32') {
//     globalShortcut.register('Control+Shift+I', () => {
//       mainWindow.webContents.openDevTools()
//     })
//   }

//   mainWindow.once('ready-to-show', () => {
//     mainWindow.setMenu(null)
//     mainWindow.show()
//   })

//   mainWindow.onbeforeunload = (e) => {
//     // Prevent Command-R from unloading the window contents.
//     e.returnValue = false
//   }

//   mainWindow.on('closed', function () {
//     mainWindow = null
//   })
// })

// app.on('window-all-closed', () => { app.quit() }) 


'use strict'
global.postGresConnection = {connection: {
  address: 'localhost', // server name or IP address;
  port: 5432,
  database: 'IngrainedQuest',
  user: 'postgres',
  password: 'shubham'
}};
const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const os = require('os')
const path = require('path')
const config = require(path.join(__dirname, 'package.json'))
// const model = require(path.join(__dirname, 'app', 'model.js'))
const model = require(path.join(__dirname, 'app/model', 'main-model.js'))

const BrowserWindow = electron.BrowserWindow
var PGconnection = {
  host: 'localhost', // server name or IP address;
  port: 5432,
  database: 'IngrainedQuest',
  user: 'postgres',
  password: 'shubham'
};
app.setName(config.productName)
var mainWindow = null
app.on('ready', function () {
  mainWindow = new BrowserWindow({
    backgroundColor: 'lightgray',
    title: config.productName,
    show: false,
    webSecurity: false,
    webPreferences: {
      nodeIntegration: true,
      defaultEncoding: 'UTF-8'
    },
    icon: path.join(__dirname, 'app/icons/trial.png')
  })
  model.connect(PGconnection,
  //model.initDb(app.getPath('userData'),
    // Load a DOM stub here. See renderer.js for the fully composed DOM.
    mainWindow.loadURL(`file://${__dirname}/app/light/pages-login.html`)
  )

  // Enable keyboard shortcuts for Developer Tools on various platforms.
  let platform = os.platform()
  if (platform === 'darwin') {
    globalShortcut.register('Command+Option+I', () => {
      mainWindow.webContents.openDevTools()
    })
  } else if (platform === 'linux' || platform === 'win32') {
    globalShortcut.register('Control+Shift+I', () => {
      mainWindow.webContents.openDevTools()
    })
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.setMenu(null)
    mainWindow.show()
  })

  mainWindow.onbeforeunload = (e) => {
    // Prevent Command-R from unloading the window contents.
    e.returnValue = false
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})

app.on('window-all-closed', () => { app.quit() })
