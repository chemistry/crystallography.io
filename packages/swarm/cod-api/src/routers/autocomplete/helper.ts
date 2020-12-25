export function buildNameWhere(name: string): any {
    if (name.length === 1) {
        return {
            a: name.toUpperCase(),
        };
    }
    if (name.length === 2) {
        return {
            ab: name.toUpperCase(),
        };
     }
    if (name.length === 3) {
        return {
            abc: name.toUpperCase(),
        };
     }
    if (name.length === 4) {
        return {
            wabcd: name.toUpperCase(),
            words: new RegExp("^" + RegExpEscape(name), "i"),
        };
     }

    return {
        wabcde: name.slice(0, 5).toUpperCase(),
        words: new RegExp("^" + RegExpEscape(name), "i"),
    };
}

function buildSingleWordWhere(word: string) {
    if (word.length === 1) {
        return {
            wa: word.toUpperCase(),
        };
    }
    if (word.length === 2) {
        return {
            wab: word.toUpperCase(),
        };
    }
    if (word.length === 3) {
        return {
            wabc: word.toUpperCase(),
        };
    }
    if (word.length === 4) {
        return {
            wabcd: word.toUpperCase(),
            words: new RegExp("^" + RegExpEscape(word), "i"),
        };
    }

    return {
        wabcde: word.slice(0, 5).toUpperCase(),
        words: new RegExp("^" + RegExpEscape(word), "i"),
    };
}

export function buildNameWhereAnd(name: string) {
    const words = name.split(" ");
    const queries = words.map((word) => {
        return buildSingleWordWhere(word);
    });

    return {
        $and: queries,
    };
}

export function buildNameWhereOr(name: string) {
    const words = name.split(" ");
    const queries = words.map((word) => {
        return buildSingleWordWhere(word);
    });

    return {
        $or: queries,
    };
}

function RegExpEscape(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
