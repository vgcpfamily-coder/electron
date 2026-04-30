const { Menu } = require('electron');
const { setTheme, getTheme } = require('./theme');

function createMenu() {
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
            win?.webContents.reload();
          }
        },
        {
          label: 'Recarregar (forçado)',
          accelerator: 'Ctrl+Shift+R',
          click: (_, win) => {
            win?.webContents.reloadIgnoringCache();
          }
        }
      ]
    },

    // NOVO MENU DE TEMA
    {
      label: 'Tema',
      submenu: [
        {
          label: 'Sistema',
          type: 'radio',
          checked: getTheme() === 'system',
          click: () => setTheme('system')
        },
        {
          label: 'Claro',
          type: 'radio',
          checked: getTheme() === 'light',
          click: () => setTheme('light')
        },
        {
          label: 'Escuro',
          type: 'radio',
          checked: getTheme() === 'dark',
          click: () => setTheme('dark')
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
            win?.webContents.toggleDevTools();
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

module.exports = { createMenu };