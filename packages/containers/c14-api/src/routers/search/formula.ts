import { Router } from 'express';
import type { Request, Response } from 'express';
import type { Db } from 'mongodb';
import * as Sentry from '@sentry/node';
import { formulaToString, parseFormula } from './formula.helper.js';
import type { FormulaObj } from './formula.helper.js';
import type { Document } from 'mongodb';

export const getFormulaSearchRouter = ({ db }: { db: Db }) => {
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

    const formula = req.body.formula || '';

    const formulaObj = parseFormula(formula, false);
    const whereSimilar = prepareWhereSimilar(formulaObj);
    const whereExact = prepareWhereExact(formulaObj);

    try {
      const [exactResults, similarResults] = await Promise.all([
        getFormulaCollection(whereExact, db),
        getFormulaCollection(whereSimilar, db),
      ]);
      const structures = [...exactResults.data, ...similarResults.data];
      return res.json({
        meta: {
          pages: 0,
          total: 0,
          searchFormula: formulaToString(formulaObj),
          exactMatchStructures: 0,
          similarMatchStructures: 0,
          similarFormulas: [],
        },
        data: {
          structures,
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

interface FormulaCollectionResult {
  formulas?: Document[];
  data: number[];
}

async function getFormulaCollection(
  where: Record<string, unknown>,
  db: Db
): Promise<FormulaCollectionResult> {
  const formulas = await db
    .collection('formulas')
    .find(where, {
      sort: { count: -1 },
      limit: 3000,
    })
    .toArray();
  if (!formulas) {
    return { data: [] };
  }
  return {
    formulas,
    data: reduceToStructure(formulas),
  };
}

function reduceToStructure(records: Document[]): number[] {
  if (records.length === 0) {
    return [];
  }
  return records.reduce<number[]>((sum, current) => {
    for (const strId of current.structures) {
      if (sum.indexOf(strId) === -1) {
        sum.push(strId);
      }
    }
    return sum;
  }, []);
}

function prepareWhere(formulaObj: FormulaObj): Record<string, unknown> {
  const formulaCopy: Record<string, unknown> = Object.assign({}, formulaObj);
  Object.keys(formulaCopy).forEach((key) => {
    if (formulaCopy[key] === '*') {
      formulaCopy[key] = { $gt: 0 };
    }
  });

  return formulaCopy;
}

function prepareWhereSimilar(formulaObj: FormulaObj): Record<string, unknown> {
  const where = prepareWhere(formulaObj);
  return {
    ...where,
    elements: { $ne: Object.keys(formulaObj).length },
  };
}

function prepareWhereExact(formulaObj: FormulaObj): Record<string, unknown> {
  const where = prepareWhere(formulaObj);
  return {
    ...where,
    elements: Object.keys(formulaObj).length,
  };
}
