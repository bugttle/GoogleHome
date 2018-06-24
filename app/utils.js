class Utils {
  static normalizeWord(text) {
    const normalizedText =
      text.trim()
        .replace(/^を\s+(.+)$/, '$1')
        .replace(/\d/g, '')  // strip numeric
        .replace(/\s+/g, '');
    console.log('[' + text + '] => [' + normalizedText + ']');
    return normalizedText;
  }
}

module.exports.utils = Utils;
