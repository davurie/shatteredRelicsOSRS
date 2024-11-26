const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.send('close-app'),
    onMarkTaskDone: (callback) => ipcRenderer.on('mark-task-done', callback),
    onMarkTaskUndo: (callback) => ipcRenderer.on('mark-task-undo', callback),
});
