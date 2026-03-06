import { sanitizeAuthorName } from './author-sanitize';
import { authorMatchRules, prefixPattern } from './author-match-rules';

export const extractAuthorsList = (doc: { [key: string]: any }): string[] => {
  const theLoops = (doc.loops || []).filter((item: any) => {
    return (item.columns || []).indexOf('_publ_author_name') !== -1;
  });
  if (theLoops.length !== 1) {
    return [];
  }
  const colIdx = theLoops[0].columns.indexOf('_publ_author_name');

  return (theLoops[0].data || []).map((row: any) => {
    if (typeof row === 'string') {
      return row;
    }
    return row[colIdx];
  });
};

export function extractAuthorDetails(authorRaw: string) {
  let author = sanitizeAuthorName(authorRaw);
  if (!author) {
    return;
  }

  // (The late) Marten G. Barker ==> Marten G. Barker
  const prefixMatch = prefixPattern.exec(author);
  if (prefixMatch) {
    author = prefixMatch[1];
  }

  for (const rule of authorMatchRules) {
    const match = rule.pattern.exec(author);
    if (match) {
      return rule.extract(match);
    }
  }

  return null;
}
