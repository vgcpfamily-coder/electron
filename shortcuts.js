const { globalShortcut, BrowserWindow } = require('electron');
const { goBack, goForward } = require('./utils');

function registerShortcuts() {
  globalShortcut.register('Control+Shift+A', () => {
    const win = BrowserWindow.getFocusedWindow();
    goBack(win?.webContents);
  });

  globalShortcut.register('Control+Shift+D', () => {
    const win = BrowserWindow.getFocusedWindow();
    goForward(win?.webContents);
  });
}

function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}

module.exports = { registerShortcuts, unregisterShortcuts };
