import { z } from 'zod';
import { Router } from 'express';
import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import * as Sentry from '@sentry/node';

const authorsPageSchema = z.number().int().min(1).max(99999);
const authorItemSchema = z.object({
  authorName: z.string().min(2),
  page: z.number().int().min(1).max(999).optional(),
});

const AUTHORS_PER_PAGE = 300;

interface AuthorAttributes {
  full: string;
  count: number;
  updated: string;
  structures?: number[];
}

interface AuthorMapped {
  id: unknown;
  type: string;
  attributes: AuthorAttributes;
}

const authorMapper = (showDetails: boolean) => {
  return (item: Record<string, unknown>): AuthorMapped => {
    const o: AuthorMapped = {
      id: item._id,
      type: 'author',
      attributes: {
        full: item.full as string,
        count: item.count as number,
        updated: item.updated as string,
      },
    };
    if (showDetails && Array.isArray(item.structures)) {
      o.attributes.structures = item.structures as number[];
    }
    return o;
  };
};

const STRUCTURES_PAGE_SIZE = 100;

export const getAuthorRouter = ({ db }: { db: Db }) => {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    let page: number = parseInt(req.query.page as string, 10);
    page = page && isFinite(page) ? page : 1;

    const validationRes = authorsPageSchema.safeParse(page);
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
      const authorsCount = await db.collection('authors').countDocuments({});
      const totalPages = Math.ceil(authorsCount / AUTHORS_PER_PAGE);

      const authors = await db
        .collection('authors')
        .find(
          {},
          {
            limit: AUTHORS_PER_PAGE,
            skip: (page - 1) * AUTHORS_PER_PAGE,
            sort: { count: -1 },
          }
        )
        .map(authorMapper(false))
        .toArray();

      return res.status(200).json({
        errors: [],
        meta: {
          total: authorsCount,
          pages: totalPages,
        },
        data: authors || [],
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

  router.get('/:name', async (req: Request, res: Response) => {
    const authorName = req.params.name;
    const page = req.query.page ? Number(req.query.page) : 1;

    const validationRes = authorItemSchema.safeParse({
      authorName,
      page,
    });
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
      const author = await db.collection('authors').findOne({
        abc: authorName.split(' ')[0].substring(0, 3).toUpperCase(),
        full: authorName,
      });

      if (!author) {
        return res.status(400).json({
          errors: [
            {
              status: 400,
              title: 'Author not found',
              detail: 'Incorrect author or page',
            },
          ],
        });
      }

      const authorStructuresCount = author.structures.length;
      const pageCount = Math.ceil(authorStructuresCount / STRUCTURES_PAGE_SIZE);
      const pageContent = author.structures.slice(
        (page - 1) * STRUCTURES_PAGE_SIZE,
        page * STRUCTURES_PAGE_SIZE
      );

      return res.json({
        meta: {
          total: authorStructuresCount,
          pages: pageCount,
          name: authorName,
        },
        data: {
          results: pageContent,
        },
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
