export const nameChars = "\\w\\u00C0-\\u021B\\-\\`''ιλḰṕḾŃḱóOů̅ουḿα\u2019";

export const aCase = /^\(.+\)\s+(.+)$/;

// Gabas, M J
export const case1 = new RegExp(
  '^([' +
    nameChars +
    '\\.]+),\\s?([' +
    nameChars +
    ']{1,})\\.?(\\s|-)+([' +
    nameChars +
    ']{1,})\\.?\\s*.*$'
);
// U.Muller
export const case2 = new RegExp('^([' + nameChars + ']{1})\\.\\s*([' + nameChars + ']+)\\.?\\,?$');
// Tian, Bei
export const case3 = new RegExp(
  '^([' + nameChars + '\\.]+),\\s?([' + nameChars + ']{1,})\\.?\\,?$'
);
// E. K. Polychroniadis
export const case4 = new RegExp(
  '^([' + nameChars + ']{1})\\.\\s*([' + nameChars + ']{1})\\.\\s*([' + nameChars + ']+)\\.?\\,?$'
);
// Li H.-Q.
export const case5 = RegExp(
  '^([' + nameChars + ']{2,})\\s+([' + nameChars + ']{1,})\\.\\-?\\s*([' + nameChars + ']{1,})\\.$'
);
// Tu Q.-Y,
export const case6 = RegExp(
  '^([' + nameChars + ']{2,})\\s+([' + nameChars + ']{1,})\\.\\-?\\s*([' + nameChars + ']{1})\\,?$'
);

// Ellen M. Scheuer
export const case7 = new RegExp(
  '^([' +
    nameChars +
    '\\.]{2,})\\.?\\s*([' +
    nameChars +
    ']{1,})\\.\\s*([' +
    nameChars +
    '\\s\\.]{2,})$'
);

// Claire Wilson
export const case8 = new RegExp('^([' + nameChars + ']{2,})\\.?\\s*([' + nameChars + ']{2,})\\.?$');

// 'de Jong, B H W S'
export const case9 = new RegExp(
  '^([' +
    nameChars +
    '\\s]{2,})\\,\\s*([' +
    nameChars +
    ']{1})\\.?\\s*([' +
    nameChars +
    ']{1})\\.?.{0,}$'
);

// Aubert E
export const case10 = new RegExp('^([' + nameChars + ']{2,})\\s+([' + nameChars + '])\\.?$');

// Yong Wah Kim
export const case11 = new RegExp(
  '^([' + nameChars + ']{2,})\\s+([' + nameChars + ']{2,})\\s+([' + nameChars + ']{2,})$'
);

// Ben Ali, A.
export const case12 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})[\\.\\,]?\\s+([' +
    nameChars +
    '])[\\.\\,]?$'
);

// M. Purificacion Sanchez
export const case14 = new RegExp(
  '^([' + nameChars + '])[\\.\\,]?\\s+([' + nameChars + ']{2,})\\s+([' + nameChars + ']{2,})$'
);

// de Matos Gomes, E
export const case15 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\,\\s+([' +
    nameChars +
    '])[\\.\\,]?$'
);

// Perez y Jorba, M
export const case16 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    '])[\\.\\,]?\\s+([' +
    nameChars +
    ']{2,})\\,\\s+([' +
    nameChars +
    '])[\\.\\,]?$'
);

// M. Khurram N. Qureshi
export const case17 = new RegExp(
  '^([' +
    nameChars +
    '])[\\.\\,]?\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    '])[\\.\\,]?\\s+([' +
    nameChars +
    ']{2,})$'
);

// Bernd D Mosel
export const case18 = new RegExp(
  '^([' + nameChars + ']{2,})\\s+([' + nameChars + '])[\\.\\,]?\\s+([' + nameChars + ']{2,})$'
);

// Leigh Anna M. Ottley
export const case19 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    '])[\\.\\,]?\\s+([' +
    nameChars +
    ']{2,})$'
);

// Harrell Jr., William A.
export const case20 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\.,\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    '])[\\.]?$'
);

// Sulastri,
export const case21 = new RegExp('^([' + nameChars + ']{1,})[\\.,]?$');

// Meenakshi, ?
export const case22 = new RegExp('^([' + nameChars + ']{1,})[\\.,\\s\\?]{1,}$');

// M Fakhfakh
export const case23 = new RegExp('^([' + nameChars + '])[\\.,]?\\s+([' + nameChars + ']{2,})$');

// Rebek Jr., Julius
export const case24 = new RegExp(
  '^([' + nameChars + ']{2,})\\s+([' + nameChars + ']{2,})\\.,\\s+([' + nameChars + ']{2,})$'
);

// Daniela Belli Dell Amico
export const case25 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})$'
);

// Amin Malik Shah Abdul Majid
export const case26 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})$'
);

// Rui Cao,
export const case27 = new RegExp('^([' + nameChars + ']{1,})\\s+([' + nameChars + ']{1,}),?$');

// Schmedt auf der Guenne, J.
export const case28 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,}), ([' +
    nameChars +
    '])[\\.]?$'
);

// K. Manheri, Muraleedharan
export const case29 = new RegExp(
  '^([' + nameChars + '])[\\.\\,]?\\s+([' + nameChars + ']{2,}),\\s+([' + nameChars + ']{2,})$'
);

// Marthinus Janse van Rensburg, J.
export const case30 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+,([' +
    nameChars +
    '])[\\.]?$'
);

// Brito B, I.
export const case31 = new RegExp(
  '^([' + nameChars + ']{2,})\\s+([' + nameChars + '])[\\.]?[,]?\\s+([' + nameChars + '])[\\.]?$'
);

// Cortes C., Laura
export const case32 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    '])[\\.]?[,]?\\s+([' +
    nameChars +
    ']{2,})[\\.]?$'
);

// S. Shanmuga Sundara Raj
export const case33 = new RegExp(
  '^([' +
    nameChars +
    '])\\.\\s?([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    ']{2,})$'
);

// OŃeill H St C
export const case34 = new RegExp(
  '^([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    '])\\s+([' +
    nameChars +
    ']{2,})\\s+([' +
    nameChars +
    '])$'
);
