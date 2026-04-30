function getUrl(argv) {
  return argv.find(a =>
    typeof a === 'string' &&
    (a.startsWith('http://') || a.startsWith('https://'))
  );
}

module.exports = { getUrl };
