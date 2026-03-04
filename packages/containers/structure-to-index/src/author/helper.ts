import { sanitizeAuthorName } from './author-sanitize';
import {
  aCase,
  case1,
  case2,
  case3,
  case4,
  case5,
  case6,
  case7,
  case8,
  case9,
  case10,
  case11,
  case12,
  case14,
  case15,
  case16,
  case17,
  case18,
  case19,
  case20,
  case21,
  case22,
  case23,
  case24,
  case25,
  case26,
  case27,
  case28,
  case29,
  case30,
  case31,
  case32,
  case33,
  case34,
} from './author-patterns';

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
  let match = aCase.exec(author);
  if (match) {
    author = match[1];
  }

  // Gabas, M J
  match = case1.exec(author);
  if (match) {
    return { family: match[1], first: match[2].charAt(0), second: match[4].charAt(0) };
  }

  // U.Muller
  match = case2.exec(author);
  if (match) {
    return { family: match[2], first: match[1].charAt(0), second: '' };
  }

  // Tian, Bei
  match = case3.exec(author);
  if (match) {
    return { family: match[1], first: match[2].charAt(0), second: '' };
  }

  // E. K. Polychroniadis
  match = case4.exec(author);
  if (match) {
    return { family: match[3], first: match[1].charAt(0), second: match[2].charAt(0) };
  }

  // Li H.-Q.
  match = case5.exec(author);
  if (match) {
    return { family: match[1], first: match[2].charAt(0), second: match[3].charAt(0) };
  }

  // Tu Q.-Y
  match = case6.exec(author);
  if (match) {
    return { family: match[1], first: match[2].charAt(0), second: match[3].charAt(0) };
  }

  // Ellen M. Scheuer
  match = case7.exec(author);
  if (match) {
    return { family: match[3], first: match[1].charAt(0), second: match[2].charAt(0) };
  }

  // Claire Wilson
  match = case8.exec(author);
  if (match) {
    return { family: match[2], first: match[1].charAt(0), second: '' };
  }

  // 'de Jong, B H W S'
  match = case9.exec(author);
  if (match) {
    return { family: match[1], first: match[2].charAt(0), second: match[3].charAt(0) };
  }

  // Aubert E
  match = case10.exec(author);
  if (match) {
    return { family: match[1], first: match[2].charAt(0), second: '' };
  }

  // Yong Wah Kim
  match = case11.exec(author);
  if (match) {
    return { family: match[1], first: match[2].charAt(0), second: match[3].charAt(0) };
  }

  // Ben Ali, A.
  match = case12.exec(author);
  if (match) {
    return { family: match[2], first: match[1].charAt(0), second: match[3].charAt(0) };
  }

  // M. Purificacion Sanchez
  match = case14.exec(author);
  if (match) {
    return { family: match[3], first: match[2].charAt(0), second: match[1].charAt(0) };
  }

  match = case15.exec(author);
  if (match) {
    return { family: match[3], first: match[2].charAt(0), second: match[4].charAt(0) };
  }

  match = case16.exec(author);
  if (match) {
    return { family: match[3], first: match[1].charAt(0), second: match[4].charAt(0) };
  }

  // M. Khurram N. Qureshi
  match = case17.exec(author);
  if (match) {
    return { family: match[4], first: match[2].charAt(0), second: match[3].charAt(0) };
  }

  // Bernd D Mosel
  match = case18.exec(author);
  if (match) {
    return { family: match[3], first: match[1].charAt(0), second: match[2].charAt(0) };
  }

  // Leigh Anna M. Ottley
  match = case19.exec(author);
  if (match) {
    return { family: match[4], first: match[2].charAt(0), second: match[3].charAt(0) };
  }

  // Harrell Jr., William A.
  match = case20.exec(author);
  if (match) {
    return { family: match[1], first: match[3].charAt(0), second: match[4].charAt(0) };
  }

  // Sulastri,
  match = case21.exec(author);
  if (match) {
    return { family: match[1], first: '', second: '' };
  }

  match = case22.exec(author);
  if (match) {
    return { family: match[1], first: '', second: '' };
  }

  match = case23.exec(author);
  if (match) {
    return { family: match[2], first: match[1].charAt(0), second: '' };
  }

  // Rebek Jr., Julius
  match = case24.exec(author);
  if (match) {
    return { family: match[1], first: match[3].charAt(0), second: '' };
  }

  // Daniela Belli Dell Amico
  match = case25.exec(author);
  if (match) {
    return { family: match[4], first: match[1].charAt(0), second: match[2].charAt(0) };
  }

  // Amin Malik Shah Abdul Majid
  match = case26.exec(author);
  if (match) {
    return { family: match[5], first: match[1].charAt(0), second: match[2].charAt(0) };
  }

  // Rui Cao,
  match = case27.exec(author);
  if (match) {
    return { family: match[2], first: match[1].charAt(0), second: '' };
  }

  // Schmedt auf der Guenne, J.
  match = case28.exec(author);
  if (match) {
    return { family: match[4], first: match[1].charAt(0), second: match[5].charAt(0) };
  }

  // K. Manheri, Muraleedharan
  match = case29.exec(author);
  if (match) {
    return { family: match[2], first: match[1].charAt(0), second: match[3].charAt(0) };
  }

  // Marthinus Janse van Rensburg, J.
  match = case30.exec(author);
  if (match) {
    return { family: match[4], first: match[1].charAt(0), second: match[5].charAt(0) };
  }

  // Brito B, I.
  match = case31.exec(author);
  if (match) {
    return { family: match[1], first: match[2].charAt(0), second: match[3].charAt(0) };
  }

  // Cortes C., Laura
  match = case32.exec(author);
  if (match) {
    return { family: match[1], first: match[3].charAt(0), second: match[2].charAt(0) };
  }

  // S. Shanmuga Sundara Raj
  match = case33.exec(author);
  if (match) {
    return { family: match[4], first: match[2].charAt(0), second: match[3].charAt(0) };
  }

  // OŃeill H St C
  match = case34.exec(author);
  if (match) {
    return { family: match[1], first: match[2].charAt(0), second: match[3].charAt(0) };
  }

  return null;
}
