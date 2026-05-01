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

module.exports = { getUrl };
