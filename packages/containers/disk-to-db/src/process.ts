import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { parse } = require('@chemistry/cif-2-json');
import * as Sentry from '@sentry/node';
import type { ObjectId } from 'mongodb';
import fs from 'node:fs';
import util from 'node:util';
import { cleanupJCif } from './helpers/index.js';
import type { AppContext } from './app.js';

export interface CodFileRecord {
  fileName: string;
  codId: string;
}

const readFile = util.promisify(fs.readFile);

export const processMessage = async ({
  fileName,
  codId,
  context,
}: {
  fileName: string;
  codId: string;
  context: AppContext;
}) => {
  try {
    const collection = context.db.collection('structures');
    const fileContent = await readFile(fileName);
    const jcif = parse(fileContent.toString()) as Record<string, Record<string, unknown>>;

    const dataNames = Object.keys(jcif);

    if (dataNames.length === 0) {
      console.error('error while parsing processing file', fileName);
      throw new Error('wrong data format');
    }

    const dataToSave = cleanupJCif(jcif[dataNames[0]]);
    const now = new Date();

    await collection.findOneAndUpdate(
      {
        _id: Number(codId) as unknown as ObjectId,
      },
      {
        $set: {
          _id: Number(codId),
          ...dataToSave,
          updated: now,
        },
        $min: {
          created: now,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);
  }
};
