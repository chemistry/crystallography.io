import { extractPayload } from "./utils";

describe("Common", () => {
    it("should export extractPayload function", () => {
        expect(extractPayload).toBeDefined();
    });
    it("should return null in case event data not provided", ()=> {
        const payload = extractPayload({ } as any);
        expect(payload).toEqual(null);
    });
    it("should return empty object in case data is {}", ()=> {
      const payload = extractPayload({ data: '{}'} as any);
      expect(payload).toEqual({});
    });
    it("should return null in case payload is not serilazable", ()=> {
      const payload = extractPayload({ data: '_'} as any);
      expect(payload).toEqual(null);
    });
});
