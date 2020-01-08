import { cifParser } from "./cif_parser";
import { splitDataBloks } from "./cif_spliter";

export function cif2json(text: string): any {
    if (!text) {
        return {};
    }

    let lines = text.replace("\r", "").split("\n");

    let data = splitDataBloks(lines);
    const result: any = {};

    const dataKeys = Object.keys(data);
    for (const key of dataKeys) {
        result[key] = cifParser(data[key]);
    }
    data = null;
    lines = null;

    return result;
}
