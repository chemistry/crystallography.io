export function extractPayload<T>(event: any): T {
    if (event && !event.data) {
        return null;
    }
    try {
      return JSON.parse(Buffer.from(event.data).toString());
    } catch (e) {
      return null;
    }
    return null;
}
