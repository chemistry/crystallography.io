import { Router } from 'express';
import type { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { z } from 'zod';
import type { Db } from 'mongodb';

const RESULTS_PER_PAGE = 100;

export const getAuthorSearchRouter = ({ db }: { db: Db }) => {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    if (!req.body) {
      return res.status(400).json({
        errors: [
          {
            code: 400,
            title: 'Invalid Body Params',
            detail: 'Invalid Body Params',
          },
        ],
      });
    }

    let name = String(req.body.name || '');
    const nameChars =
      "\\w\\u00C0-\\u021B\\-\\x60''\\u03B9\\u03BB\\u1E30\\u1E55\\u1E3E\\u0143\\u1E31\\u00F3O\\u016F\\u03BF\\u03C5\\u1E3F\\u03B1\\u2019";
    name = name
      .replace(new RegExp('[^' + nameChars + '\\.\\-\\s]', 'v'), '')
      .replace(/\s+/g, ' ')
      .trim();

    const parsedPage = parseInt(req.body.page as string, 10);
    const page = parsedPage && isFinite(parsedPage) ? parsedPage : 1;

    const authorSearchSchema = z.object({
      name: z.string().min(3).max(255),
      page: z.number().int().min(1).max(99999),
    });

    const validationRes = authorSearchSchema.safeParse({ name, page });

    if (!validationRes.success) {
      return res.status(400).json({
        errors: [
          {
            code: 400,
            title: 'Incorrect author or page',
            detail: validationRes.error.issues,
          },
        ],
      });
    }

    const where = buildAuthorWhere(name);

    try {
      const authors: {
        full: string;
        count: number;
        structures: number[];
      }[] = await db
        .collection('authors')
        .find(where, {
          sort: { count: -1 },
        })
        .map((doc) => ({
          full: doc.full as string,
          count: doc.count as number,
          structures: doc.structures as number[],
        }))
        .toArray();

      const authorsCollection = authors.map(({ full, count }) => ({ full, count }));
      const structuresIds = authors.reduce(
        (acc: number[], { structures }) => acc.concat(structures),
        [] as number[]
      );
      const uniqStructureIds = [...new Set([...structuresIds])];

      const totalPages = Math.ceil(uniqStructureIds.length / RESULTS_PER_PAGE);
      const resultingPages = uniqStructureIds.slice(
        (page - 1) * RESULTS_PER_PAGE,
        page * RESULTS_PER_PAGE
      );

      return res.json({
        meta: {
          searchString: req.body.name,
          authors: authorsCollection,
          total: uniqStructureIds.length,
          pages: totalPages,
        },
        data: {
          structures: resultingPages,
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

function buildAuthorWhere(name: string) {
  if (name.length === 1) {
    return {
      a: name.toUpperCase(),
    };
  }
  if (name.length === 2) {
    return {
      ab: name.toUpperCase(),
    };
  }
  if (name.length === 3) {
    return {
      abc: name.toUpperCase(),
    };
  }

  return {
    abc: name.slice(0, 3).toUpperCase(),
    full: new RegExp('^' + RegExpEscape(name), 'i'),
  };
}

function RegExpEscape(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
