function getUrl(argv) {
  const arg = argv.find(a =>
    typeof a === 'string' &&
    (a.startsWith('http://') || a.startsWith('https://') || a.startsWith('p://'))
  );
  
  if (arg && arg.startsWith('p://')) {
    const query = arg.slice(4); // Remove 'p://'
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
  
  return arg;
}

function goBack(webContents) {
  const history = webContents?.navigationHistory;

  if (history) {
    if (history.canGoBack()) {
      history.goBack();
    }
    return;
  }

  if (webContents?.canGoBack?.()) {
    webContents.goBack();
  }
}

function goForward(webContents) {
  const history = webContents?.navigationHistory;

  if (history) {
    if (history.canGoForward()) {
      history.goForward();
    }
    return;
  }

  if (webContents?.canGoForward?.()) {
    webContents.goForward();
  }
}

module.exports = { getUrl, goBack, goForward };
