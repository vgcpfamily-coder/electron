const { BrowserWindow, session } = require('electron');
const path = require('node:path');
const { setupAdblocker, injectAdblockerCosmetics } = require('./adblocker');
const { injectDarkMode } = require('./theme');

const PARTITION = 'persist:main';
let windows = [];

async function createWindow(url, locale = 'pt-BR') {
  const ses = session.fromPartition(PARTITION);

  if (!ses._adblockInitialized) {
  //  try {
  //     await setupAdblocker(ses);
  //     ses._adblockInitialized = true;
  //   } catch (err) {
  //     console.warn('Falha ao inicializar adblocker:', err);
  //   }
    
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      partition: PARTITION,
      backgroundThrottling: false,
    },
  });

  // Aumentar limite de listeners para evitar warning
  win.webContents.setMaxListeners(1000);

  // Habilitar corretor ortográfico
  win.webContents.session.setSpellCheckerLanguages(['pt-BR']);

  console.log('📱 Nova janela criada - PID do processo:', process.pid);
  win.loadURL(url);

  win.on('closed', () => {
    windows = windows.filter(w => w !== win);
  });

  win.webContents.on('did-finish-load', () => {
    console.log('🎬 Motor de Render:', navigator.userAgent);

    // Injetar estilo de ocultação de anúncios e detecção de adblock
    // injectAdblockerCosmetics(win.webContents);

    // Injetar tema escuro
    injectDarkMode(win.webContents);

  //   // Injetar Google Translate
  //   win.webContents.executeJavaScript(`
  //   (function() {
  //     // Carregar Google Translate
  //     if (!window.googleTranslateLoaded) {
  //       const script = document.createElement('script');
  //       script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  //       document.head.appendChild(script);
  //       window.googleTranslateLoaded = true;
  //     }
      
  //     window.googleTranslateElementInit = function() {
  //       if (window.google && window.google.translate && window.google.translate.TranslateElement) {
  //         new google.translate.TranslateElement(
  //           {pageLanguage: 'en', includedLanguages: 'pt,es,fr,de,it,ja,zh-CN,ru', layout: google.translate.TranslateElement.InlineLayout.SIMPLE},
  //           'google_translate_element'
  //         );
  //       }
  //     };
      
  //     // Criar elemento para o tradutor
  //     if (!document.getElementById('google_translate_element')) {
  //       const div = document.createElement('div');
  //       div.id = 'google_translate_element';
  //       div.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: white; padding: 8px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
  //       document.body.appendChild(div);
  //     }
  //   })();
  // `).catch(err => {
  //     console.warn('Erro ao injetar Google Translate:', err);
  //   });
  });
  windows.push(win);
  return win;
}

module.exports = { createWindow };
