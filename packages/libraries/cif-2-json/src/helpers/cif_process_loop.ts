import { normalizeCifString } from "../normalizeCifString";
import { unquoteLine } from "./cif_utils_unquote";

const LOOP_KEY = /^_(\S+)$/;
const MULTI_LINE_COMMENTS_DELIMER = /^(\s*);(.{0,})$/;

export function cifProcessLoop(lines: string[]) {
    let val;
    let line;
    let values = [];
    const columns = [];
    const data = [];
    let multilineMatch = false;

    line = lines.pop();
    while (line && line.length > 1 && line.startsWith("_") && LOOP_KEY.exec(line)) {
        const key = "_" + LOOP_KEY.exec(line)[1];
        columns.push(key);
        line = (lines.length > 0) ? lines.pop() : undefined;
    }

    /* eslint-disable no-labels */
    loopData: while (isDataLine(line)) {
        values = [];
        multilineMatch = !!MULTI_LINE_COMMENTS_DELIMER.exec(line);
        if (multilineMatch) {
            lines.push(line);
            val = readMultilineData(lines);
            values = [val];
        } else {
            values = splitDataLine(line, columns.length);
        }

        while (columns.length > values.length) {
            if (lines.length === 0) {
                line = undefined;
                break loopData;
            }
            line = lines.pop();

            if (!isDataLine(line)) {
                break loopData;
            }
            multilineMatch = !!MULTI_LINE_COMMENTS_DELIMER.exec(line);
            if (multilineMatch) {
                lines.push(line);
                val = readMultilineData(lines);
                values = values.concat([val]);
            } else {
                val = splitDataLine(line, -1);
                values = values.concat(val);
            }
        }

        data.push(values);
        line = (lines.length > 0) ? lines.pop() : undefined;
    }
    /* eslint-enable no-labels   */

    // put the last line back
    if (typeof line !== "undefined") {
        lines.push(line);
    }

    if (columns.length && data.length) {
        return {
            columns,
            data,
        };
    }
    // no data found
    return null;
}

/**
 * will read multiline data
 */
function readMultilineData(lines: string[]) {
    let line = lines.pop();
    const multilineMatch = MULTI_LINE_COMMENTS_DELIMER.exec(line);
    if (multilineMatch) {
        const resLines = [];
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

        return resLines.join("\n");
    }
}

/**
 * true is line still corespond loop data block
 */
function isDataLine(line: string): boolean {
    if (!line) {
        return false;
    }

    const LOOP_START = /^(\s*)loop_(\s*)$/i;
    if (line.length > 4 && (line.startsWith("loop_") || line.startsWith("lOOP_")) || LOOP_START.exec(line)) {
        return false;
    }

    const SINGLE_LINE_COMMENT = /^_.+$/;
    if (line.length > 2 && line.startsWith("_") && SINGLE_LINE_COMMENT.exec(line)) {
        return false;
    }
    return true;
}

function unquoteAndReplace(str: string): string {
    const text = unquoteLine(str);
    return normalizeCifString(text);
}

const DELIMER =  /^\s{1}$/;

function splitDataLine(str: string, keysArrLength: number): string[] {
    if (keysArrLength === 1 && str.length > 1) {
        return [unquoteAndReplace(str)];
    }

    const items = [];
    let item = "";
    for (let i = 0; i < str.length; i++) {
        let ch = str.charAt(i);
        if (item === "" && (ch === '"' || ch === "'")) {
            // unquote
            const initCh = ch;
            while (i < str.length - 1) {
                // next
                i++;
                ch = str.charAt(i);
                if (ch === "\\" && i < str.length - 2) {
                    i++;
                    ch = str.charAt(i);
                    item = item + ch;
                    continue;
                }
                if (ch === initCh) {
                    break;
                }
                item = item + ch;
            }
            items.push(item);
            item = "";
            continue;
        }
        // Delimer ? skeep it
        if (DELIMER.exec(ch)) {
            continue;
        }
        while (!DELIMER.exec(ch) && i < str.length) {
            item = item + ch;
            i++;
            ch = str.charAt(i);
        }
        items.push(item !== "." ? item : "");
        item = "";
    }
    return items;
}
