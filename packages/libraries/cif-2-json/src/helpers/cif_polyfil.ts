/* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
if (typeof String.prototype.startsWith !== "function") {
    String.prototype.startsWith = function(str) {
        return this.indexOf(str) === 0;
    };
}
