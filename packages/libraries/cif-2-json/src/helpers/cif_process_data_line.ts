import { normalizeCifString } from "../normalizeCifString";
import { unquoteLine } from "./cif_utils_unquote";

// CONSTANTS
const SINGLE_LINE_COMMENT = /^_(\S+)(\s+)(\S+|'.*'|".*")(\s*)$/;
const MULTI_LINE_COMMENTS = /^_(\S+)(\s*)$/;
const MULTI_LINE_COMMENTS_DELIMER = /^(\s*);(.{0,})$/;

export function cifProcessDataLine(lines: string[]) {
    let line;
    let result;
    let value;
    let key;
    let match;
    let match2;
    let resLines;

    line = lines.pop();
    result = Object.create(null);

    if (line.startsWith("_") && SINGLE_LINE_COMMENT.exec(line)) {
        match = SINGLE_LINE_COMMENT.exec(line);
        key = "_" + match[1];
        value = match[3];
        result[key] = (value === "?" ? "" : unquoteAndReplace(value));
        return result;
    }

    if (lines.length > 1) {
        if (line.startsWith("_")) {
            match2 = MULTI_LINE_COMMENTS.exec(line);

            if (match2) {
                const multilineMatch = MULTI_LINE_COMMENTS_DELIMER.exec(lines[lines.length - 1]);
                if (multilineMatch) {
                    // multiline Comment found
                    key = "_" + match2[1];

                    lines.pop(); // ";"

                    resLines = [];
                    const firstline = (multilineMatch[2] || "").trim();
                    if (firstline) {
                        resLines.push(firstline);
                    }

                    while (lines.length !== 0) {
                        line = lines.pop();

                        if (MULTI_LINE_COMMENTS_DELIMER.exec(line)) {
                            break;
                        }

                        resLines.push(line);
                    }

                    value = resLines.join("\n");

                    result[key] = (value === "?" ? "" : unquoteAndReplace(value));
                    return result;
                } else {
                    key = "_" + match2[1];
                    value = lines.pop();
                    result[key] = (value === "?" ? "" : unquoteAndReplace(value));
                    return result;
                }
            }
        }
    }

    return result;
}

function unquoteAndReplace(str: string) {
    const text = unquoteLine(str);
    return normalizeCifString(text);
}
