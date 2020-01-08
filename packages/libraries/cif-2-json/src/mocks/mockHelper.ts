export function loadMock(toload: string): string {
    const isNode = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
    if (isNode) {
        const fs = require("fs");
        const path = require("path");
        return fs.readFileSync(path.join(__dirname, "/data/" + toload)).toString();
    }
    // browser
    const text = require("raw-loader!./data/" + toload);
    return text;
}
