let FROM: string[] = [];
let TO: string[] = [];
/* tslint:disable:max-line-length */
// 1. Greek letters
// Based on list :: http://www.dionysia.org/html/entities/symbols.html
FROM = FROM.concat(["$-alpha", "$-beta", "$-gamma", "$-delta", "$-epsilon", "$-zeta", "$-eta", "$-theta", "$-iota", "$-kappa", "$-lambd", "$-mu", "$-nu", "$-xi", "$-omicron", "$-pi", "$-rho", "$-sigmaf", "$-sigma", "$-tau", "$-upsilon", "$-phi", "$-chi", "$-psi", "$-omega", "$-thetasym", "$-upsih", "$-piv"]);
TO = TO.concat(["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "ς", "σ", "τ", "υ", "φ", "χ", "ψ", "ω", "ϑ", "ϒ", "ϖ"]);

FROM = FROM.concat(["$-ALPHA", "$-BETA", "$-GAMMA", "$-DELTA", "$-EPSILON", "$-ZETA", "$-ETA", "$-THETA", "$-IOTA", "$-KAPPA", "$-LAMBD", "$-MU", "$-NU", "$-XI", "$-OMICRON", "$-PI", "$-RHO", "$-SIGMAF", "$-SIGMA", "$-TAU", "$-UPSILON", "$-PHI", "$-CHI", "$-PSI", "$-OMEGA", "$-THETASYM", "$-UPSIH", "$-PIV"]);
TO = TO.concat(["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "ς", "σ", "τ", "υ", "φ", "χ", "ψ", "ω", "ϑ", "ϒ", "ϖ"]);

// based on coding :: \%beta notation
FROM = FROM.concat(["\\%alpha", "\\%beta", "\\%gamma", "\\%delta", "\\%epsilon", "\\%zeta", "\\%eta", "\\%theta", "\\%iota", "\\%kappa", "\\%lambda", "\\%mu", "\\%nu", "\\%xi", "\\%omicron", "\\%pi", "\\%rho", "\\%sigmaf", "\\%sigma", "\\%tau", "\\%upsilon", "\\%phi", "\\%chi", "\\%psi", "\\%omega", "\\%thetasym", "\\%upsih", "\\%piv"]);
TO = TO.concat(["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "ς", "σ", "τ", "υ", "φ", "χ", "ψ", "ω", "ϑ", "ϒ", "ϖ"]);

// Based on pure CIF format :: small
FROM = FROM.concat(["\\a", "\\b", "\\c", "\\d", "\\e", "\\f", "\\g", "\\h", "\\i", "\\k", "\\l", "\\m", "\\n", "\\o", "\\p", "\\q", "\\r", "\\s", "\\t", "\\u", "\\w", "\\x", "\\y", "\\z"]);
TO = TO.concat(["α", "β", "χ", "δ", "ε", "φ", "γ", "η", "ι", "κ", "λ", "μ", "ν", "ο", "π", "θ", "ρ", "σ", "τ", "υ", "ω", "ξ", "ψ", "ζ"]);

// Based on pure CIF format :: large
FROM = FROM.concat(["\\A", "\\B", "\\C", "\\D", "\\E", "\\F", "\\G", "\\H", "\\I", "\\K", "\\L", "\\M", "\\N", "\\O", "\\P", "\\Q", "\\R", "\\S", "\\T", "\\U", "\\W", "\\X", "\\Y", "\\Z"]);
TO = TO.concat(["Α", "Β", "Χ", "Δ", "Ε", "Φ", "Γ", "Η", "Ι", "Κ", "Λ", "Μ", "Ν", "Ο", "Π", "Θ", "Ρ", "Σ", "Τ", "Υ", "Ω", "Ξ", "Ψ", "Ζ"]);

// 2. Accented letters
// acute (é)
FROM = FROM.concat(["\\'A", "\\'a", "\\'C", "\\'c", "\\'E", "\\'e", "\\'G", "\\'g", "\\'I", "\\'i", "\\'K", "\\'k", "\\'L", "\\'l", "\\'M", "\\'m", "\\'N", "\\'n", "\\'O", "\\'o", "\\'P", "\\'p", "\\'R", "\\'r", "\\'S", "\\'s", "\\'U", "\\'u", "\\'W", "\\'w", "\\'X", "\\'x", "\\'Y", "\\'y", "\\'Z", "\\'z", "\\'Ι", "\\'ı"]);
TO = TO.concat(["Á", "á", "Ć", "ć", "É", "é", "Ǵ", "ǵ", "Í", "í", "Ḱ", "ḱ", "Ĺ", "ĺ", "Ḿ", "ḿ", "Ń", "ń", "Ó", "ó", "Ṕ", "ṕ", "Ŕ", "ŕ", "Ś", "ś", "Ú", "ú", "Ẃ", "ẃ", "X́", "x́", "Ý", "ý", "Ź", "ź", "Í", "í"]);

// grave (à)
FROM = FROM.concat(["\\`e", "\\`u", "\\`o", "\\`a", "\\`i", "\\`E", "\\`U", "\\`O", "\\`A", "\\`I", "\\`t", "\\`T", "\\`z", "\\`Z", "\\`Ι", "\\`ı"]);
TO = TO.concat(["è", "ù", "ò", "à", "ì", "È", "Ù", "Ò", "À", "Ì", "t", "T", "z", "Z", "Ì", "ì"]);

// circumflex (â)
FROM = FROM.concat(["\\^e", "\\^o", "\\^a", "\\^u", "\\^i", "\\^E", "\\^O", "\\^A", "\\^U", "\\^I", "\\^Ι", "\\^ι", "\\^C", "\\^c", "\\^G", "\\^g"]);
TO = TO.concat(["ê", "ô", "â", "û", "î", "Ê", "Ô", "Â", "Û", "Î", "Î", "î", "Ĉ", "ĉ", "Ĝ", "ĝ"]);

// cedilla (ç)
FROM = FROM.concat(["\\,A", "\\,a", "\\,C", "\\,c", "\\,D", "\\,d", "\\,E", "\\,e", "\\,G", "\\,g", "\\,H", "\\,h", "\\,I", "\\,i", "\\,K", "\\,k", "\\,L", "\\,l", "\\,M", "\\,m", "\\,N", "\\,n", "\\,Q", "\\,q", "\\,R", "\\,r", "\\,S", "\\,s", "\\,T", "\\,t", "\\,U", "\\,u", "\\,X", "\\,x", "\\,Z", "\\,z", "\\,Ι", "\\,ι"]);
TO = TO.concat(["A̧", "a̧", "Ç", "ç", "Ḑ", "ḑ", "Ȩ", "ȩ", "Ģ", "ģ", "Ḩ", "ḩ", "I̧", "i̧", "Ķ", "ķ", "Ļ", "ļ", "M̧", "m̧", "Ņ", "ņ", "O̧", "o̧", "Ŗ", "ŗ", "Ş", "ş", "Ţ", "ţ", "U̧", "u̧", "X̧", "x̧", "Z̧", "z̧", "I̧", "i̧"]);

// umlaut (ü)
FROM = FROM.concat(['\\"e', '\\"o', '\\"a', '\\"u', '\\"i', '\\"E', '\\"O', '\\"A', '\\"U', '\\"I', '\\"Y', '\\"y']);
TO = TO.concat(["ë", "ö", "ä", "ü", "ï", "Ë", "Ö", "Ä", "Ü", "Ï", "Ÿ", "ÿ"]);

// tilde (ñ)
FROM = FROM.concat(["\\~A", "\\~a", "\\~O", "\\~o", "\\~U", "\\~u", "\\~N", "\\~n"]);
TO = TO.concat(["Ã", "ã", "Õ", "õ", "Ũ", "ũ", "Ñ", "ñ"]);

// ogonek
FROM = FROM.concat(["\\;A", "\\;a", "\\;E", "\\;e", "\\;I", "\\;i", "\\;Q", "\\;q", "\\;U", "\\;u", "\\;C", "\\;c", "\\;S", "\\;s", "\\;T", "\\;t"]);
TO = TO.concat(["Ą", "ą", "Ę", "ę", "Į", "į", "Ǫ", "ǫ", "Ų", "ų", "Ç", "ç", "Ş", "ş", "Ţ", "ţ"]);

// Double acute accent (Hungarian umlaut)
FROM = FROM.concat(["\\>A", "\\>E", "\\>I", "\\>O", "\\>U", "\\>a", "\\>e", "\\>i", "\\>o", "\\>u"]);
TO = TO.concat(["A̋", "E̋", "I̋", "Ő", "Ű", "a̋", "e̋", "i̋", "ő", "ű"]);

// overbar
FROM = FROM.concat(["\\=A", "\\=a", "\\=E", "\\=e", "\\=I", "\\=i", "\\=O", "\\=o", "\\=U", "\\=u", "\\=H", "\\=h"]);
TO = TO.concat(["Ā", "ā", "Ē", "ē", "Ī", "ī", "Ō", "ō", "Ū", "ū", "Ħ", "ħ"]);

// overdot symbols
FROM = FROM.concat(["\\.A", "\\.a", "\\.B", "\\.b", "\\.C", "\\.c", "\\.D", "\\.d", "\\.E", "\\.e", "\\.F", "\\.f", "\\.G", "\\.g", "\\.H", "\\.h", "\\.I", "\\.i", "\\.M", "\\.m", "\\.N", "\\.n", "\\.O", "\\.o", "\\.P", "\\.p", "\\.R", "\\.r", "\\.S", "\\.s", "\\.T", "\\.t", "\\.W", "\\.w", "\\.X", "\\.x", "\\.Y", "\\.y", "\\.Z", "\\.z", "\\.Ι", "\\.ı"]);
TO = TO.concat(["Ȧ", "ȧ", "Ḃ", "ḃ", "Ċ", "ċ", "Ḋ", "ḋ", "Ė", "ė", "Ḟ", "ḟ", "Ġ", "ġ", "Ḣ", "ḣ", "İ", "ı", "Ṁ", "ṁ", "Ṅ", "ṅ", "Ȯ", "ȯ", "Ṗ", "ṗ", "Ṙ", "ṙ", "Ṡ", "ṡ", "Ṫ", "ṫ", "Ẇ", "ẇ", "Ẋ", "ẋ", "Ẏ", "ẏ", "Ż", "ż", "\\I", "\\i"]);

// hacek
FROM = FROM.concat(["\\<Z", "\\<z", "\\<C", "\\<c", "\\<E", "\\<e", "\\<N", "\\<n", "\\<R", "\\<r", "\\<S", "\\<s", "\\<D", "\\<d", "\\<L", "\\<l", "\\<G", "\\<g", "\\<T", "\\<t", "\\<U", "\\<u", "\\<A", "\\<a"]);
TO = TO.concat(["Ž", "ž", "Č", "č", "Ě", "ě", "Ň", "ň", "Ř", "ř", "Š", "š", "Ď", "ď", "L", "l", "Ğ", "ğ", "Ť", "ť", "Ŭ", "ŭ", "Ă", "ă"]);

// \( breve Ă
FROM = FROM.concat(["\\(A", "\\(a", "\\(E", "\\(e", "\\(G", "\\(g", "\\(I", "\\(I", "\\(O", "\\(o", "\\(U", "\\(u", "\\(C", "\\(c", "\\(S", "\\(s", "\\(R", "\\(r"]);
TO = TO.concat(["Ă", "ă", "Ĕ", "ĕ", "Ğ", "ğ", "Ĭ", "ĭ", "Ŏ", "ŏ", "Ŭ", "ŭ", "Č", "č", "Š", "š", "Ř", "ř"]);

// ring replace
FROM = FROM.concat(["°a", "°A", "\\%a", "\\%A", "°u", "°U"]);
TO = TO.concat(["å", "Å", "å", "Å", "ů", "Ů"]);

// Special Replace #1
FROM = FROM.concat(["\\/l", "\\/L", "\\/o", "\\/O", "\\&s", "\\/D", "\\/d", "\\?i", "\\I"]);
TO = TO.concat(["ł", "Ł", "ø", "Ø", "ß", "Đ", "đ", "ı", "ı"]);

// 3. Other characters
FROM = FROM.concat(["\\%", "\\\\times", "--", "\\\\neq", "---", "\\\\square", "+-", "\\\\rangle", "-+", "\\\\langle", "\\\\sim", "\\\\rightarrow", "\\\\simeq", "\\\\leftarrow", "\\\\infty"]);
TO = TO.concat(["°", "×", "—–", "≠", "—–", "□", "±", "&gt;", "±", "&lt;", "~", "→", "≈", "←", "∞"]);

const FROM_REGEX: RegExp[] = FROM.map((toReplace) => {
    return new RegExp(escapeRegExp(toReplace), "g");
});

/* tslint:enable:max-line-length */

export function normalizeCifString(text: string): string {
    let from;
    let to;
    if (!text) {
        return "";
    }
    if (
        text.indexOf("\\") === -1 &&
        text.indexOf("&#") === -1 &&
        text.indexOf("°") === -1 &&
        text.indexOf("$-") === -1
    ) {
        return text;
    }

    text = replaceChars(text, FROM_REGEX, TO);

    // Symbol codes
    text = text.replace(new RegExp("&#x([0-9ABCDEF]{4});", "g"), (match, code) => {
        const codedec = parseInt(code, 16);
        return String.fromCharCode(codedec);
    });

    // Something were not interpreted
    /* tslint:disable:max-line-length */
    from = ["'", '\\"', "\\=", "\\`", "\\~", "\\.", "\\^", "\\;", "\\<", "\\,", "\\>", "\\(", "\\?", "\\&", "\\/", "\\%"];
    to = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    /* tslint:enable:max-line-length */
    text = replaceChars(text, from, to);

    return text;
}

function replaceChars(text: string, fromRegex: RegExp[] | string[], to: string[]): string {
    for (let i = 0; i < fromRegex.length; i++) {
        text = text.replace(fromRegex[i], to[i]);
    }
    return text;
}

function escapeRegExp(str: string): string {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
