import routeData from "./assets/routeData.json" with { type: "json" };
import { taskFlow } from "./src/taskFlow.js";

taskFlow.init(routeData);

document
  .getElementById("mark-done-btn")
  .addEventListener("click", () => taskFlow.markAsDone());
document
  .getElementById("undo-btn")
  .addEventListener("click", () => taskFlow.undo());

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.code === "Space") {
    event.preventDefault();
    taskFlow.markAsDone();
  }
  if (event.shiftKey && event.code === "Space") {
    event.preventDefault();
    if (taskFlow.hasPreviousTask()) taskFlow.undo();
  }
});

// const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
// const path = require('path');

// let mainWindow;

// app.on('ready', () => {
//     mainWindow = new BrowserWindow({
//         width: 900,
//         height: 400,
//         alwaysOnTop: true,
//         frame: false,
//         resizable: true,
//         webPreferences: {
//             preload: path.join(__dirname, 'preload.js'),
//             contextIsolation: true,
//             nodeIntegration: false
//         },
//     });

//     mainWindow.loadFile('index.html');

//     globalShortcut.register('Control+Space', () => {
//         if (mainWindow) {
//             mainWindow.webContents.send('mark-task-done');
//         }
//     });

//     globalShortcut.register('Shift+Space', () => {
//         if (mainWindow) {
//             mainWindow.webContents.send('mark-task-undo');
//         }
//     });
// });

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });

// ipcMain.on('close-app', () => {
//     mainWindow.close();
// });

// app.on('will-quit', () => {
//     globalShortcut.unregisterAll();
// });
