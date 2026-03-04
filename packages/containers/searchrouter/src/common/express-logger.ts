import * as path from 'path';
import * as fs from 'fs';

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

  const mw = (req: any, res: any, next: any) => {
    next();
  };

  return { logger, mw };
};
