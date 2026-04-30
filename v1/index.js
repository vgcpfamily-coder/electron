const { app, BrowserWindow, session } = require('electron');
const path = require('node:path');
const { setupAdblocker } = require('./adblocker');
const { globalShortcut } = require('electron');

const { Menu } = require('electron');

const template = [
  {
    label: 'NAV',
    submenu: [
      {
        label: 'Voltar',
        accelerator: 'Alt+Left',
        click: (_, win) => {
          if (win?.webContents.canGoBack()) {
            win.webContents.goBack();
          }
        }
      },
      {
        label: 'Avançar',
        accelerator: 'Alt+Right',
        click: (_, win) => {
          if (win?.webContents.canGoForward()) {
            win.webContents.goForward();
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Recarregar',
        accelerator: 'Ctrl+R',
        click: (_, win) => {
          if (win) {
            win.webContents.reload();
          }
        }
      },
      {
        label: 'Recarregar (forçado)',
        accelerator: 'Ctrl+Shift+R',
        click: (_, win) => {
          if (win) {
            win.webContents.reloadIgnoringCache();
          }
        }
      }
    ]
  },
  {
    label: 'DEV',
    submenu: [
      {
        label: 'Abrir DevTools',
        accelerator: 'F12',
        click: (_, win) => {
          if (win) {
            win.webContents.toggleDevTools();
          }
        }
      }
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
let windows = [];
const PARTITION = 'persist:main';
function getFocusedWindow() {
  return BrowserWindow.getFocusedWindow();
}
async function createWindow(url) {
  const ses = session.fromPartition(PARTITION);

  // inicializa UMA vez
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
      backgroundThrottling: true,
      spellcheck: false,
      images: true,
    },
  });

  win.loadURL(url);

  win.on('closed', () => {
    windows = windows.filter(w => w !== win);
  });

  windows.push(win);
return win
}

function getUrl(argv) {
  return argv.find(a =>
    typeof a === 'string' &&
    (a.startsWith('http://') || a.startsWith('https://'))
  );
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(async () => {
    const url =
      getUrl(process.argv) ||
      'https://www.youtube.com';

      const win =  await createWindow(url);


  });

  app.on('second-instance', async (event, commandLine) => {
    const url = getUrl(commandLine);
    if (url) {
  const win =  await createWindow(url);

    }
  });
}
