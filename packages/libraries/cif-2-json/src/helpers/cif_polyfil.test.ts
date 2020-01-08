describe("startsWith prototype", () => {
    it("should define method", () => {
        const originalStartWith = String.prototype.startsWith;
        String.prototype.startsWith = null;
        // tslint:disable-next-line
        require('./cif_polyfil');
        expect("hello".startsWith("h")).toEqual(true);
        String.prototype.startsWith = originalStartWith;
    });
});
