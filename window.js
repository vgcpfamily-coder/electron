const { BrowserWindow, session } = require('electron');
const path = require('node:path');
const { setupAdblocker } = require('./adblocker');

const PARTITION = 'persist:main';
let windows = [];

async function createWindow(url) {
  const ses = session.fromPartition(PARTITION);

  if (!ses._adblockInitialized) {
    await setupAdblocker(ses);
    ses._adblockInitialized = true;
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      partition: PARTITION,
    },
  });

  win.loadURL(url);

  win.on('closed', () => {
    windows = windows.filter(w => w !== win);
  });

  windows.push(win);
  return win;
}

module.exports = { createWindow };
