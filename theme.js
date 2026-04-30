const { nativeTheme } = require('electron');

function setTheme(mode) {
  // 'dark' | 'light' | 'system'
  nativeTheme.themeSource = mode;
}

function getTheme() {
  return nativeTheme.themeSource;
}

module.exports = { setTheme, getTheme };