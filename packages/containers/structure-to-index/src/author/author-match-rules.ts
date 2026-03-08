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

export interface AuthorDetails {
  family: string;
  first: string;
  second: string;
}

interface AuthorMatchRule {
  pattern: RegExp;
  extract: (match: RegExpExecArray) => AuthorDetails;
}

const charOf = (s: string) => s.charAt(0);

export const authorMatchRules: AuthorMatchRule[] = [
  // Gabas, M J
  { pattern: case1, extract: (m) => ({ family: m[1], first: charOf(m[2]), second: charOf(m[4]) }) },
  // U.Muller
  { pattern: case2, extract: (m) => ({ family: m[2], first: charOf(m[1]), second: '' }) },
  // Tian, Bei
  { pattern: case3, extract: (m) => ({ family: m[1], first: charOf(m[2]), second: '' }) },
  // E. K. Polychroniadis
  { pattern: case4, extract: (m) => ({ family: m[3], first: charOf(m[1]), second: charOf(m[2]) }) },
  // Li H.-Q.
  { pattern: case5, extract: (m) => ({ family: m[1], first: charOf(m[2]), second: charOf(m[3]) }) },
  // Tu Q.-Y
  { pattern: case6, extract: (m) => ({ family: m[1], first: charOf(m[2]), second: charOf(m[3]) }) },
  // Ellen M. Scheuer
  { pattern: case7, extract: (m) => ({ family: m[3], first: charOf(m[1]), second: charOf(m[2]) }) },
  // Claire Wilson
  { pattern: case8, extract: (m) => ({ family: m[2], first: charOf(m[1]), second: '' }) },
  // de Jong, B H W S
  { pattern: case9, extract: (m) => ({ family: m[1], first: charOf(m[2]), second: charOf(m[3]) }) },
  // Aubert E
  { pattern: case10, extract: (m) => ({ family: m[1], first: charOf(m[2]), second: '' }) },
  // Yong Wah Kim
  {
    pattern: case11,
    extract: (m) => ({ family: m[1], first: charOf(m[2]), second: charOf(m[3]) }),
  },
  // Ben Ali, A.
  {
    pattern: case12,
    extract: (m) => ({ family: m[2], first: charOf(m[1]), second: charOf(m[3]) }),
  },
  // M. Purificacion Sanchez
  {
    pattern: case14,
    extract: (m) => ({ family: m[3], first: charOf(m[2]), second: charOf(m[1]) }),
  },
  // de Matos Gomes, E
  {
    pattern: case15,
    extract: (m) => ({ family: m[3], first: charOf(m[2]), second: charOf(m[4]) }),
  },
  // Perez y Jorba, M
  {
    pattern: case16,
    extract: (m) => ({ family: m[3], first: charOf(m[1]), second: charOf(m[4]) }),
  },
  // M. Khurram N. Qureshi
  {
    pattern: case17,
    extract: (m) => ({ family: m[4], first: charOf(m[2]), second: charOf(m[3]) }),
  },
  // Bernd D Mosel
  {
    pattern: case18,
    extract: (m) => ({ family: m[3], first: charOf(m[1]), second: charOf(m[2]) }),
  },
  // Leigh Anna M. Ottley
  {
    pattern: case19,
    extract: (m) => ({ family: m[4], first: charOf(m[2]), second: charOf(m[3]) }),
  },
  // Harrell Jr., William A.
  {
    pattern: case20,
    extract: (m) => ({ family: m[1], first: charOf(m[3]), second: charOf(m[4]) }),
  },
  // Sulastri,
  { pattern: case21, extract: (m) => ({ family: m[1], first: '', second: '' }) },
  // Meenakshi, ?
  { pattern: case22, extract: (m) => ({ family: m[1], first: '', second: '' }) },
  // M Fakhfakh
  { pattern: case23, extract: (m) => ({ family: m[2], first: charOf(m[1]), second: '' }) },
  // Rebek Jr., Julius
  {
    pattern: case24,
    extract: (m) => ({ family: m[1], first: charOf(m[3]), second: '' }),
  },
  // Daniela Belli Dell Amico
  {
    pattern: case25,
    extract: (m) => ({ family: m[4], first: charOf(m[1]), second: charOf(m[2]) }),
  },
  // Amin Malik Shah Abdul Majid
  {
    pattern: case26,
    extract: (m) => ({ family: m[5], first: charOf(m[1]), second: charOf(m[2]) }),
  },
  // Rui Cao,
  { pattern: case27, extract: (m) => ({ family: m[2], first: charOf(m[1]), second: '' }) },
  // Schmedt auf der Guenne, J.
  {
    pattern: case28,
    extract: (m) => ({ family: m[4], first: charOf(m[1]), second: charOf(m[5]) }),
  },
  // K. Manheri, Muraleedharan
  {
    pattern: case29,
    extract: (m) => ({ family: m[2], first: charOf(m[1]), second: charOf(m[3]) }),
  },
  // Marthinus Janse van Rensburg, J.
  {
    pattern: case30,
    extract: (m) => ({ family: m[4], first: charOf(m[1]), second: charOf(m[5]) }),
  },
  // Brito B, I.
  {
    pattern: case31,
    extract: (m) => ({ family: m[1], first: charOf(m[2]), second: charOf(m[3]) }),
  },
  // Cortes C., Laura
  {
    pattern: case32,
    extract: (m) => ({ family: m[1], first: charOf(m[3]), second: charOf(m[2]) }),
  },
  // S. Shanmuga Sundara Raj
  {
    pattern: case33,
    extract: (m) => ({ family: m[4], first: charOf(m[2]), second: charOf(m[3]) }),
  },
  // ONeill H St C
  {
    pattern: case34,
    extract: (m) => ({ family: m[1], first: charOf(m[2]), second: charOf(m[3]) }),
  },
];

export const prefixPattern = aCase;
