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
    const locale = app.getLocale(); // Pega o idioma do SO
    console.log('🌍 Idioma do sistema:', locale);
    console.log('🔷 Processo Principal PID:', process.pid);
    console.log('✅ Node.js versão:', process.versions.node);

    createMenu();
    registerShortcuts();

    const url =
      getUrl(process.argv) ||
      'https://www.youtube.com';

    await createWindow(url, locale);
  });

  app.on('second-instance', async (_, commandLine) => {
    const locale = app.getLocale();
    const url = getUrl(commandLine);
    if (url) {
      await createWindow(url, locale);
    }
  });

  app.on('will-quit', () => {
    unregisterShortcuts();
  });
}
