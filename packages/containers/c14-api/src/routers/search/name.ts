import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import type { Db } from 'mongodb';
import { mapStructure } from '../../helpers/index.js';
import * as Sentry from '@sentry/node';

const RESULTS_PER_PAGE = 100;

const structureMapper = mapStructure(false);

export const getNameSearchRouter = ({ db }: { db: Db }) => {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    if (!req.body) {
      return res.status(500).json({
        errors: [
          {
            code: 500,
            title: 'Invalid Body Params',
            detail: 'Invalid Body Params',
          },
        ],
      });
    }

    let page: number = parseInt(req.body.page as string, 10);
    page = page && isFinite(page) ? page : 1;

    let name = req.body.name || '';
    name = name
      .replace(/[^a-z0-9\-'.,α-ωΑ-Ω\s]/gim, '')
      .replace(/\s+/g, ' ')
      .trim();

    const pageNameSchema = z.object({
      name: z.string().min(3).max(255),
      page: z.number().int().min(1).max(99999),
    });

    const validationRes = pageNameSchema.safeParse({ name, page });

    if (!validationRes.success) {
      return res.status(400).json({
        errors: [
          {
            status: 400,
            title: 'Incorrect author or page',
            detail: validationRes.error.issues,
          },
        ],
      });
    }

    const where = { $text: { $search: name } };

    try {
      const [structuresCount, structures] = await Promise.all([
        db.collection('structures').countDocuments(where),
        db
          .collection('structures')
          .find(where)
          .project({ score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } })
          .limit(RESULTS_PER_PAGE)
          .skip((page - 1) * RESULTS_PER_PAGE)
          .map(structureMapper)
          .toArray(),
      ]);
      const totalPages = Math.ceil(structuresCount / RESULTS_PER_PAGE);

      return res.json({
        meta: {
          total: structuresCount,
          pages: totalPages,
          searchString: req.body.name,
        },
        data: structures,
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
