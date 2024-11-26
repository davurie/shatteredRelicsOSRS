const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 400,
        alwaysOnTop: true,
        frame: false,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
    });

    mainWindow.loadFile('index.html');

    globalShortcut.register('Control+Space', () => {
        if (mainWindow) {
            mainWindow.webContents.send('mark-task-done');
        }
    });

    globalShortcut.register('Shift+Space', () => {
        if (mainWindow) {
            mainWindow.webContents.send('mark-task-undo');
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('close-app', () => {
    mainWindow.close();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
