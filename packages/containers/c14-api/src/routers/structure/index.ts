import type { Db } from 'mongodb';
import { z } from 'zod';
import { Router } from 'express';
import type { Request, Response } from 'express';
import { mapStructure } from '../../helpers';
import * as Sentry from '@sentry/node';

const structureIdSchema = z.number().int().min(1000000).max(9999999);
const structureListSchema = z.array(structureIdSchema).min(1).max(200);

export const getStructureRouter = ({ db }: { db: Db }) => {
  const router = Router();

  // Structure details
  router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const structure = await db.collection('structures').findOne({
        _id: Number(id) as any,
      });

      res.json({
        meta: {},
        cache: {
          type: 'structure',
        },
        errors: [],
        data: structure,
      });
    } catch (e: any) {
      console.error(e.stack);
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

  // Get structures list by Id's
  router.post('/', async (req: Request, res: Response) => {
    const { ids, expand } = req?.body || { ids: '[]', expand: false };
    const structureMapper = mapStructure(expand);

    let structuresIds: number[] = [];
    try {
      structuresIds = JSON.parse(ids);
    } catch (e: any) {
      console.error(`error in parsing : ${ids},  ERROR: ${e}`);
    }

    try {
      const validationRes = structureListSchema.safeParse(structuresIds);
      if (!validationRes.success) {
        return res.status(400).json({
          errors: [
            {
              status: 400,
              title: 'Incorrect structure ids',
              details: validationRes.error.issues,
            },
          ],
        });
      }

      const data = await db
        .collection('structures')
        .find({
          _id: { $in: structuresIds } as any,
        })
        .map(structureMapper)
        .toArray();

      return res.status(200).json({
        errors: [],
        meta: {},
        cache: {
          type: 'structure-details',
        },
        data,
      });
    } catch (e: any) {
      console.error(String(e));
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
