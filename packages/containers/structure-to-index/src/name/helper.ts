export interface WordsRecord {
    words: string[];
    firstword: string;
    name: string;
}

export function prepareWords(chemName: string): WordsRecord {
    const SMALL_WORDS_SIZE = 3;
    const searchWords = [];
    let firstword = "";
    // eslint-disable-line no-useless-escape
    const name = chemName.replace(/<\/?[^>]+(>|$)/g, "").replace(/[^\-()'a-z/\\,.\][α-ωΑ-Ω0-9]/gmi, " ").replace(/\s+/g, " ").trim();

    const words = name.split(" ");
    for (const word of words) {
        if (!firstword) {
            firstword = word;
        }
        if (word.length > SMALL_WORDS_SIZE) {
            searchWords.push(word.toLowerCase());
        }
    }

    return {
        words: searchWords,
        firstword,
        name: ucFirst(name),
    };
}

function ucFirst(str: string): string {
    if (!str || !str.length) {
        return str || "";
    }
    const f = str.charAt(0).toUpperCase();
    return f + str.substr(1, str.length - 1);
}
