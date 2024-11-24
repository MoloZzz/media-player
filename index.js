const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer', 'main.js'),
            contextIsolation: true,
            nodeIntegration: true,
        }
    });
    mainWindow.loadFile('renderer/view/index.html');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
