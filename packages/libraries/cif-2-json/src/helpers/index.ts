import { cifParser } from './cif_parser';
import { splitDataBloks } from './cif_spliter';

export function cif2json(text: string): any {
  if (!text) {
    return {};
  }

  const lines = text.replace('\r', '').split('\n');

  const data = splitDataBloks(lines);
  const result: any = {};

  const dataKeys = Object.keys(data);
  for (const key of dataKeys) {
    result[key] = cifParser(data[key]);
  }

  return result;
}
