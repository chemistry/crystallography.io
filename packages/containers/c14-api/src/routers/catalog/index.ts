import { z } from 'zod';
import { Router } from 'express';
import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import * as Sentry from '@sentry/node';

const catalogPageSchema = z.number().int().min(1).max(99999);
const PER_PAGE = 100;

const catalogMapper = (item: Record<string, unknown>) => {
  return {
    id: item._id,
    type: 'catalog',
    attributes: {
      id: item._id,
      structures: item.structures,
    },
  };
};

export const getCatalogRouter = ({ db }: { db: Db }) => {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    let page: number = parseInt(req.query.page as string, 10);
    page = page && isFinite(page) ? page : 1;

    const validationRes = catalogPageSchema.safeParse(page);
    if (!validationRes.success) {
      return res.status(400).json({
        errors: [
          {
            code: 400,
            message: 'Incorrect page',
            details: validationRes.error.issues,
          },
        ],
      });
    }

    try {
      const pages = await db.collection('catalog').count({});
      const catalog = await db
        .collection('catalog')
        .find({})
        .sort({ id: 1 })
        .skip((page - 1) * PER_PAGE)
        .limit(PER_PAGE)
        .map(catalogMapper)
        .toArray();

      res.json({
        meta: {
          pages,
        },
        cache: {
          type: 'catalog',
        },
        errors: [],
        data: catalog,
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
