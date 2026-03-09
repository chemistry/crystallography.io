import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Request, Response, NextFunction } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPackageName = () => {
  const packagePath = path.resolve(__dirname, '../../package.json');
  const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());
  return (packageJSON.name || 'unknown').replace('@chemistry/', '');
};

export const getLogger = async () => {
  const logger = {
    info: (text: string) => {
      console.log(text);
    },
    error: (text: string) => {
      console.error(text);
    },
    trace: (text: string) => {
      console.log(text);
    },
  };

  const mw = (req: Request, res: Response, next: NextFunction) => {
    next();
  };

  return { logger, mw };
};
