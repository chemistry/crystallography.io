function escapeRegExp(str: string) {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

const charReplacements = [
  "'",
  '\\"',
  '\\=',
  '\\`',
  '\\~',
  '\\.',
  '\\^',
  '\\;',
  '\\<',
  '\\,',
  '\\>',
  '\\(',
  '\\?',
  '\\&',
  '\\/',
  '\\%',
];
const charReplaceTo = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
const charReplaceRegex = charReplacements.map((str) => new RegExp(escapeRegExp(str), 'g'));

const htmlEntityRegex = new RegExp('&#x([0-9ABCDEF]{4});', 'g');

export function sanitizeAuthorName(author: string): string | null {
  author = author.trim().replace(/\s\s+/g, ' ');
  author = author.replace(/\\/g, '');
  author = author.replace(/\\`/g, '');
  author = author.replace(/\\`/g, '');
  author = author.replace(/°u/g, 'ů');

  for (let i = 0; i < charReplaceRegex.length; i++) {
    author = author.replace(charReplaceRegex[i], charReplaceTo[i]);
  }

  // http://www.iucrj.org/m/services/editguide.html
  author = author.replace(htmlEntityRegex, (_match, code) => {
    const codedec = parseInt(code, 16);
    return String.fromCharCode(codedec);
  });

  if (author === '' || author === ';') {
    return null;
  }

  return author;
}
