const { nativeTheme } = require('electron');

function setTheme(mode) {
  // 'dark' | 'light' | 'system'
  nativeTheme.themeSource = mode;
}

function getTheme() {
  return nativeTheme.themeSource;
}

// Injetar CSS para forçar dark mode em sites
function injectDarkMode(webContents) {
  const darkModeCSS = `
    @media (prefers-color-scheme: dark) {
     /* * { 
        background-color: #1e1e1e !important;
        color: #e0e0e0 !important;
      }
        */
      body { 
        background-color: #1a1a1a !important;
        color: #e0e0e0 !important;
      }
      a { color: #64b5f6 !important; }
      button, input[type="button"], input[type="submit"] {
        background-color: #2d2d2d !important;
        color: #e0e0e0 !important;
        border-color: #404040 !important;
      }
      input, textarea, select {
        background-color: #2d2d2d !important;
        color: #e0e0e0 !important;
        border-color: #404040 !important;
      }
      ::-webkit-scrollbar {
        width: 10px;
      }
      ::-webkit-scrollbar-track {
        background-color: #1a1a1a !important;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #404040 !important;
        border-radius: 5px;
      }
    }
  `;

  webContents.executeJavaScript(`
    (function() {
      // Forçar prefers-color-scheme para dark
      if (window.matchMedia) {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkMode.media !== 'not all' && !darkMode.matches) {
          // Alguns sites usam JS para detectar preferência
          Object.defineProperty(window.matchMedia('(prefers-color-scheme: dark)'), 'matches', {
            value: true
          });
        }
      }
      
      // Injetar CSS de dark mode
      const style = document.createElement('style');
      style.textContent = \`${darkModeCSS}\`;
      document.head.appendChild(style);
      
      // Tentar remover temas claros inline
      document.querySelectorAll('[style*="background-color: white"], [style*="background: white"]').forEach(el => {
        el.style.backgroundColor = '#1e1e1e';
        el.style.color = '#e0e0e0';
      });
    })();
  `);
}

module.exports = { setTheme, getTheme, injectDarkMode };