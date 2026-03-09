import type { Request } from 'express';

import type { Db, InsertOneResult } from 'mongodb';

export enum SearchType {
  'structure' = 'structure',
  'author' = 'author',
  'name' = 'name',
  'formula' = 'formula',
  'unitCell' = 'unitCell',
}
export async function saveSearchLog({
  config,
  req,
  searchType,
  details,
  results,
}: {
  config: { db: Db };
  req: Request;
  searchType: SearchType;
  details: object;
  results: { pages: number; total: number };
}): Promise<InsertOneResult> {
  const { db } = config;
  const doc = {
    ip: getUserIP(req),
    uid: getUid(req),
    data: new Date(),
    searchType,
    details,
    results,
  };
  return db.collection('search-logs').insertOne(doc);
}
function getUserIP(req: Request): string {
  return (
    String(req.headers['x-forwarded-for'] || '')
      .split(',')
      .pop() ||
    req.socket.remoteAddress ||
    ''
  );
}
function getUid(req: Request) {
  return req.headers['x-uid'] || '';
}
