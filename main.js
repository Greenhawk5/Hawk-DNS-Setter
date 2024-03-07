const { app, BrowserWindow, ipcMain, globalShortcut  } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        frame: false,
        webPreferences: {
            sandbox: false,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, `/preload.js`)
        }
    });
    mainWindow.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

app.on('ready', () => {
    // Register a shortcut listener for Ctrl + Shift + I
    globalShortcut.register('Control+Shift+I', () => {
        // When the user presses Ctrl + Shift + I, this function will get called
        // You can modify this function to do other things, but if you just want
        // to disable the shortcut, you can just return false
        return false;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
