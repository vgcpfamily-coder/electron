const { app } = require('electron');
const { createWindow } = require('./window');
const { createMenu } = require('./menu');
const { registerShortcuts, unregisterShortcuts } = require('./shortcuts');
const { getUrl } = require('./utils');

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(async () => {
    createMenu();
    registerShortcuts();

    const url =
      getUrl(process.argv) ||
      'https://www.youtube.com';

    await createWindow(url);
  });

  app.on('second-instance', async (_, commandLine) => {
    const url = getUrl(commandLine);
    if (url) {
      await createWindow(url);
    }
  });

  app.on('will-quit', () => {
    unregisterShortcuts();
  });
}
