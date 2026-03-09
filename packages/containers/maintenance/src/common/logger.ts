import path from 'node:path';
import fs from 'node:fs';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPackageName = () => {
  const packagePath = path.resolve(__dirname, '../../package.json');
  const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());
  return (packageJSON.name || 'unknown').replace('@chemistry/', '');
};

export const getLogger = async () => {
  return {
    info: (text: string) => {
      console.log(text);
    },
    error: (text: string) => {
      console.error(text);
    },
    trace: (text: string) => {
      console.log(text);
    },
    setTraceId: (_id: string) => {
      // No-op
    },
  };
};
