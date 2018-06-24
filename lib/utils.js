'use strict';

const fs = require('fs');

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

  static loadJsonFile(filePath) {
    const content = fs.readFileSync(filePath);
    return JSON.parse(content);
  }
}

module.exports.utils = Utils;
