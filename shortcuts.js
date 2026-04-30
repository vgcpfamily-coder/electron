const { globalShortcut, BrowserWindow } = require('electron');

function registerShortcuts() {
  globalShortcut.register('Control+Shift+A', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win?.webContents.canGoBack()) {
      win.webContents.goBack();
    }
  });

  globalShortcut.register('Control+Shift+D', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win?.webContents.canGoForward()) {
      win.webContents.goForward();
    }
  });
}

function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}

module.exports = { registerShortcuts, unregisterShortcuts };
