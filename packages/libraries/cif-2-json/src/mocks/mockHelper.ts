import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadMock(toload: string): string {
  return fs.readFileSync(path.join(__dirname, '/data/' + toload)).toString();
}
