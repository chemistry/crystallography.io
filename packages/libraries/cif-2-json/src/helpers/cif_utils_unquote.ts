export function unquoteLine(str: string): string {
    if (!str) {
        return "";
    }
    if (str.length < 2) {
        return str;
    }
    if (str.charAt(0) === "'" && str.charAt(str.length - 1) === "'") {
        return replaceAll(str.substring(1, str.length - 1), "'", "'");
    }
    if (str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') {
        return replaceAll(str.substring(1, str.length - 1), '\\"', '"');
    }
    return str;
}

function replaceAll(text: string, from: string, to: string) {
    return text.replace(new RegExp(escapeRegExp(from), "g"), to);
}

function escapeRegExp(str: string): string {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
