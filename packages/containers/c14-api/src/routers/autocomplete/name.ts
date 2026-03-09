import { z } from 'zod';
import { Router } from 'express';
import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import { buildNameWhere, buildNameWhereAnd, buildNameWhereOr } from './helper.js';
import * as Sentry from '@sentry/node';

const RESULTS_PER_SUGGESTION = 100;

export const getNameAutocompleteRouter = ({ db }: { db: Db }) => {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    let name = String(req.query.name || '');
    name = name
      .replace(/[^\-()'a-z/\\,.\][α-ωΑ-Ω0-9]/gim, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const nameSchema = z.object({
      name: z.string().min(1).max(255),
    });

    const validationRes = nameSchema.safeParse({ name });

    if (!validationRes.success) {
      return res.status(400).json({
        errors: [
          {
            code: 400,
            title: 'Incorrect name for autocomplete',
            detail: validationRes.error.issues,
          },
        ],
      });
    }

    try {
      const isSingleWordSuggestion = name.split(' ').length === 1;

      if (isSingleWordSuggestion) {
        const where = buildNameWhere(name);

        const [namesCount, names] = await Promise.all([
          getNamesCount(where, db),
          getNameCollection(where, db),
        ]);
        return res.status(200).json({
          meta: {
            limit: 100,
            items: namesCount,
          },
          data: names,
        });
      }

      const whereOR = buildNameWhereOr(name);
      const whereAnd = buildNameWhereAnd(name);

      const [andNamesCount, andNames, orNamesCount, orNames] = await Promise.all([
        getNamesCount(whereAnd, db),
        getNameCollection(whereAnd, db),
        getNamesCount(whereOR, db),
        getNameCollection(whereOR, db),
      ]);

      andNames.sort((name1, name2) => {
        return name1.name.length - name2.name.length;
      });

      const words = name.split(' ');
      orNames.sort((name1, name2) => {
        const occurrence =
          numberOccurrence(words, name1.name) - numberOccurrence(words, name2.name);
        if (occurrence !== 0) {
          return occurrence;
        }
        return name1.name.length - name2.name.length;
      });

      const totalNamesCount = Math.min(andNamesCount + orNamesCount, 100);

      let namesCombined = [...andNames, ...orNames];
      namesCombined = uniqById(namesCombined);
      if (namesCombined.length > 100) {
        namesCombined.length = 100;
      }

      return res.json({
        meta: {
          limit: 100,
          items: totalNamesCount,
        },
        data: namesCombined,
      });
    } catch (e: unknown) {
      console.error(e instanceof Error ? e.stack : String(e));
      Sentry.captureException(e);
      return res.status(500).json({
        errors: [
          {
            status: 500,
            title: 'Unknown Error',
            detail: String(e),
          },
        ],
        meta: {},
      });
    }
  });

  return router;
};

interface NameEntry {
  _id: unknown;
  name: string;
  count: number;
}

const getNamesCount = async (where: Record<string, unknown>, db: Db): Promise<number> => {
  return await db.collection('names').countDocuments(where);
};
const getNameCollection = async (where: Record<string, unknown>, db: Db): Promise<NameEntry[]> => {
  return await db
    .collection('names')
    .find(where)
    .sort({ count: -1 })
    .limit(RESULTS_PER_SUGGESTION)
    .map((doc) => ({ _id: doc._id, name: doc.name as string, count: doc.count as number }))
    .toArray();
};
const uniqById = (names: NameEntry[]): NameEntry[] => {
  const res: NameEntry[] = [];
  const addedIds: string[] = [];
  names.forEach((name) => {
    const id = String(name._id);
    if (addedIds.indexOf(id) === -1) {
      res.push(name);
      addedIds.push(id);
    }
  });
  return res;
};

const numberOccurrence = (words: string[], sentence: string) => {
  return words.reduce((res, curr) => {
    return sentence.indexOf(curr) !== -1 ? res + 1 : res;
  }, 0);
};
