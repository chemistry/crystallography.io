// tslint:disable:max-line-length
const aCase = /^\(.+\)\s+(.+)$/;
const nameChars = "\\w\\u00C0-\\u021B\\-\\`'’ιλḰṕḾŃḱóOů̅ουḿα\u2019";

// Gabas, M J
const case1 = new RegExp("^([" + nameChars + "\\.]+),\\s?([" + nameChars + "]{1,})\\.?(\\s|-)+([" + nameChars + "]{1,})\\.?\\s*.*$");
// U.Muller
const case2 = new RegExp("^([" + nameChars + "]{1})\\.\\s*([" + nameChars + "]+)\\.?\\,?$");
// Tian, Bei
const case3 = new RegExp("^([" + nameChars + "\\.]+),\\s?([" + nameChars + "]{1,})\\.?\\,?$");
// E. K. Polychroniadis
const case4 = new RegExp("^([" + nameChars + "]{1})\\.\\s*([" + nameChars + "]{1})\\.\\s*([" + nameChars + "]+)\\.?\\,?$");
// Li H.-Q.
const case5 = RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{1,})\\.\\-?\\s*([" + nameChars + "]{1,})\\.$");
// Tu Q.-Y,
const case6 = RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{1,})\\.\\-?\\s*([" + nameChars + "]{1})\\,?$");

// Ellen M. Scheuer
const case7 = new RegExp("^([" + nameChars + "\\.]{2,})\\.?\\s*([" + nameChars + "]{1,})\\.\\s*([" + nameChars + "\\s\\.]{2,})$");

// Claire Wilson
const case8 = new RegExp("^([" + nameChars + "]{2,})\\.?\\s*([" + nameChars + "]{2,})\\.?$");

// 'de Jong, B H W S'
const case9 = new RegExp("^([" + nameChars + "\\s]{2,})\\,\\s*([" + nameChars + "]{1})\\.?\\s*([" + nameChars + "]{1})\\.?.{0,}$");

// Aubert E
const case10 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "])\\.?$");

// Yong Wah Kim
const case11 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})$");

// Ben Ali, A.
const case12 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})[\\.\\,]?\\s+([" + nameChars + "])[\\.\\,]?$");

// M. Purificacion Sanchez
const case14 = new RegExp("^([" + nameChars + "])[\\.\\,]?\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})$");

// de Matos Gomes, E
const case15 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\,\\s+([" + nameChars + "])[\\.\\,]?$");

// Perez y Jorba, M
const case16 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "])[\\.\\,]?\\s+([" + nameChars + "]{2,})\\,\\s+([" + nameChars + "])[\\.\\,]?$");

// M. Khurram N. Qureshi
const case17 = new RegExp("^([" + nameChars + "])[\\.\\,]?\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "])[\\.\\,]?\\s+([" + nameChars + "]{2,})$");

// Bernd D Mosel
const case18 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "])[\\.\\,]?\\s+([" + nameChars + "]{2,})$");

// Leigh Anna M. Ottley
const case19 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "])[\\.\\,]?\\s+([" + nameChars + "]{2,})$");

// Harrell Jr., William A.
const case20 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\.,\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "])[\\.]?$");

// Sulastri,
const case21 = new RegExp("^([" + nameChars + "]{1,})[\\.,]?$");

// Meenakshi, ?
const case22 = new RegExp("^([" + nameChars + "]{1,})[\\.,\\s\\?]{1,}$");

// M Fakhfakh
const case23 = new RegExp("^([" + nameChars + "])[\\.,]?\\s+([" + nameChars + "]{2,})$");

// Rebek Jr., Julius
const case24 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\.,\\s+([" + nameChars + "]{2,})$");

// Daniela Belli Dell Amico
const case25 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})$");

// Amin Malik Shah Abdul Majid
const case26 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})$");

// Rui Cao,
const case27 = new RegExp("^([" + nameChars + "]{1,})\\s+([" + nameChars + "]{1,}),?$");

// Schmedt auf der Guenne, J.
const case28 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,}), ([" + nameChars + "])[\\.]?$");

// K. Manheri, Muraleedharan
const case29 = new RegExp("^([" + nameChars + "])[\\.\\,]?\\s+([" + nameChars + "]{2,}),\\s+([" + nameChars + "]{2,})$");

// Marthinus Janse van Rensburg, J.
const case30 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+,([" + nameChars + "])[\\.]?$");

// Brito B, I.
const case31 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "])[\\.]?[,]?\\s+([" + nameChars + "])[\\.]?$");

// Cortes C., Laura
const case32 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "])[\\.]?[,]?\\s+([" + nameChars + "]{2,})[\\.]?$");

// S. Shanmuga Sundara Raj
const case33 = new RegExp("^([" + nameChars + "])\\.\\s?([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "]{2,})$");

// OŃeill H St C
const case34 = new RegExp("^([" + nameChars + "]{2,})\\s+([" + nameChars + "])\\s+([" + nameChars + "]{2,})\\s+([" + nameChars + "])$");

// unprocessed symbols
const from = ["'", '\\"', "\\=", "\\`", "\\~", "\\.", "\\^", "\\;", "\\<", "\\,", "\\>", "\\(", "\\?", "\\&", "\\/", "\\%"];
const to = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
const fromRegex = from.map((str) => new RegExp(escapeRegExp(str), "g"));

const regexSymbol = new RegExp("&#x([0-9ABCDEF]{4});", "g");
export function extractAuthorDetails(author: string) {
    author = author.trim().replace(/\s\s+/g, " ");
    author = author.replace(/\\/g, "");
    author = author.replace(/\\`/g, "");
    author = author.replace(/\\`/g, "");
    author = author.replace(/°u/g, "ů");

    author = replaceChars(author, fromRegex, to);
    // http://www.iucrj.org/m/services/editguide.html
    author = author.replace(regexSymbol, (zmatch, code) => {
        const codedec = parseInt(code, 16);
        return String.fromCharCode(codedec);
    });

    if (author === "" || author === ";") {
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
        return {
            family: match[1],
            first: match[2].charAt(0),
            second: match[4].charAt(0),
        };
    }

    // U.Muller
    match = case2.exec(author);
    if (match) {
        return {
            family: match[2],
            first: match[1].charAt(0),
            second: "",
        };
    }

    // Tian, Bei
    match = case3.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[2].charAt(0),
            second: "",
        };
    }

    // E. K. Polychroniadis
    match = case4.exec(author);
    if (match) {
        return {
            family: match[3],
            first: match[1].charAt(0),
            second: match[2].charAt(0),
        };
    }

    // Li H.-Q.
    match = case5.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[2].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // Tu Q.-Y
    match = case6.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[2].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // Ellen M. Scheuer
    match = case7.exec(author);
    if (match) {
        return {
            family: match[3],
            first: match[1].charAt(0),
            second: match[2].charAt(0),
        };
    }

    // Claire Wilson
    match = case8.exec(author);
    if (match) {
        return {
            family: match[2],
            first: match[1].charAt(0),
            second: "",
        };
    }
    // 'de Jong, B H W S'
    match = case9.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[2].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // Aubert E
    match = case10.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[2].charAt(0),
            second: "",
        };
    }

    // Yong Wah Kim
    match = case11.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[2].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // Ben Ali, A.
    match = case12.exec(author);
    if (match) {
        return {
            family: match[2],
            first: match[1].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // M. Purificacion Sanchez
    match = case14.exec(author);
    if (match) {
        return {
            family: match[3],
            first: match[2].charAt(0),
            second: match[1].charAt(0),
        };
    }

    match = case15.exec(author);
    if (match) {
        return {
            family: match[3],
            first: match[2].charAt(0),
            second: match[4].charAt(0),
        };
    }

    match = case16.exec(author);
    if (match) {
        return {
            family: match[3],
            first: match[1].charAt(0),
            second: match[4].charAt(0),
        };
    }

    // M. Khurram N. Qureshi
    match = case17.exec(author);
    if (match) {
        return {
            family: match[4],
            first: match[2].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // Bernd D Mosel
    match = case18.exec(author);
    if (match) {
        return {
            family: match[3],
            first: match[1].charAt(0),
            second: match[2].charAt(0),
        };
    }

    // Leigh Anna M. Ottley
    match = case19.exec(author);
    if (match) {
        return {
            family: match[4],
            first: match[2].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // Harrell Jr., William A.
    match = case20.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[3].charAt(0),
            second: match[4].charAt(0),
        };
    }

    // Sulastri,
    match = case21.exec(author);
    if (match) {
        return {
            family: match[1],
            first: "",
            second: "",
        };
    }

    match = case22.exec(author);
    if (match) {
        return {
            family: match[1],
            first: "",
            second: "",
        };
    }

    match = case23.exec(author);
    if (match) {
        return {
            family: match[2],
            first: match[1].charAt(0),
            second: "",
        };
    }

    // Rebek Jr., Julius
    match = case24.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[3].charAt(0),
            second: "",
        };
    }
    // Daniela Belli Dell Amico
    match = case25.exec(author);
    if (match) {
        return {
            family: match[4],
            first: match[1].charAt(0),
            second: match[2].charAt(0),
        };
    }
    // Amin Malik Shah Abdul Majid
    match = case26.exec(author);
    if (match) {
        return {
            family: match[5],
            first: match[1].charAt(0),
            second: match[2].charAt(0),
        };
    }

    // Rui Cao,
    match = case27.exec(author);
    if (match) {
        return {
            family: match[2],
            first: match[1].charAt(0),
            second: "",
        };
    }

    // Schmedt auf der Guenne, J.
    match = case28.exec(author);
    if (match) {
        return {
            family: match[4],
            first: match[1].charAt(0),
            second: match[5].charAt(0),
        };
    }

    // K. Manheri, Muraleedharan
    match = case29.exec(author);
    if (match) {
        return {
            family: match[2],
            first: match[1].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // Marthinus Janse van Rensburg, J.
    match = case30.exec(author);
    if (match) {
        return {
            family: match[4],
            first: match[1].charAt(0),
            second: match[5].charAt(0),
        };
    }

    // Brito B, I.
    match = case31.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[2].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // Cortes C., Laura
    match = case32.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[3].charAt(0),
            second: match[2].charAt(0),
        };
    }

    // S. Shanmuga Sundara Raj
    match = case33.exec(author);
    if (match) {
        return {
            family: match[4],
            first: match[2].charAt(0),
            second: match[3].charAt(0),
        };
    }

    // OŃeill H St C
    match = case34.exec(author);
    if (match) {
        return {
            family: match[1],
            first: match[2].charAt(0),
            second: match[3].charAt(0),
        };
    }

    return null;
}

function replaceChars(text: string, fromRegexL: RegExp[], toL: string[]) {
    for (let i = 0; i < fromRegexL.length; i++) {
        text = text.replace(fromRegexL[i], toL[i]);
    }
    return text;
}
function escapeRegExp(str: string) {
    return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}
