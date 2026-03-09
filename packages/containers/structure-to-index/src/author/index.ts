import type { Collection, Document, Filter, WithId } from 'mongodb';
import type { AppContext } from '../app.js';
import { extractAuthorDetails } from './helper.js';

export const processAuthorsIndex = async ({
  structureId,
  context,
}: {
  structureId: number;
  context: AppContext;
}) => {
  const { logger, db } = context;

  const structureDB = db.collection('structures');
  const doc = await structureDB.findOne({ _id: structureId } as unknown as Filter<Document>);
  if (!doc) {
    return;
  }

  const authorsList = extractAuthorsList(doc) || [];

  if (authorsList.length === 0) {
    return;
  }
  const authorsDB = db.collection('authors');

  const authorsToSave = authorsList
    .map((item) => {
      const recognizedRecord = extractAuthorDetails(item);
      if (!recognizedRecord) {
        logger.info(`Unprocessed author found: ${item} docId: ${doc._id} `);
        return null;
      }
      return {
        docId: doc._id,
        name: item,
        recognizedRecord,
      };
    })
    .filter((item) => !!item);

  for (const authorRecord of authorsToSave) {
    await saveAuthorRecord(authorsDB, authorRecord);
  }

  await saveAuthorsToDoc(structureDB, authorsToSave, doc._id as unknown as number);
  await ensureAuthorsDBIndexes(authorsDB);
};

async function saveAuthorRecord(
  authorsDB: Collection,
  recordData: {
    docId: unknown;
    name: string;
    recognizedRecord: { family?: string; first?: string; second?: string };
  }
) {
  const record = recordData.recognizedRecord;
  const family = ucfirst(record.family || '');
  const full = getAuthorFullByDetails(record);

  const row = {
    a: family.substring(0, 1).toUpperCase(),
    ab: family.substring(0, 2).toUpperCase(),
    abc: family.substring(0, 3).toUpperCase(),
    family,
    first: (record.first || '').charAt(0).toUpperCase(),
    second: (record.second || '').charAt(0).toUpperCase(),
    full,
  };

  const authorSaveRecord = await authorsDB.findOneAndUpdate(
    {
      abc: row.abc,
      family: row.family,
      first: row.first,
      second: row.second,
    },
    {
      $set: { ...row },
    },
    {
      upsert: true,
      returnDocument: 'after',
    }
  );

  if (!authorSaveRecord) {
    return;
  }

  const authorDoc = await authorsDB.findOne({
    _id: authorSaveRecord._id,
  });

  if (!authorDoc) {
    return;
  }

  const authorStructures = (authorDoc.structures as unknown[]) || [];
  if (authorStructures.indexOf(recordData.docId) === -1) {
    authorStructures.push(recordData.docId);
  }

  const now = new Date();

  await authorsDB.findOneAndUpdate(
    {
      _id: authorDoc._id,
    },
    {
      $set: {
        structures: authorStructures,
        count: authorStructures.length,
        updated: now,
      },
      $min: {
        created: now,
      },
    }
  );
}

async function saveAuthorsToDoc(
  structureDB: Collection,
  authorRecordsData: {
    name: string;
    recognizedRecord: { family?: string; first?: string; second?: string };
  }[],
  docId: number
) {
  const authorsInfo = authorRecordsData.map((item) => {
    return {
      name: item.name,
      link: getAuthorFullByDetails(item.recognizedRecord),
    };
  });

  await structureDB.updateOne(
    {
      _id: docId as unknown as Filter<Document>['_id'],
    },
    {
      $set: {
        __authors: authorsInfo,
      },
    }
  );
}

async function ensureAuthorsDBIndexes(authorsDB: Collection) {
  await authorsDB.createIndex({ abc: 1 });
  await authorsDB.createIndex({ a: 1, count: -1 });
  await authorsDB.createIndex({ ab: 1, count: -1 });
  await authorsDB.createIndex({ abc: 1, count: -1 });
}

function getAuthorFullByDetails(
  autorDB: { family?: string; first?: string; second?: string } | null
): string {
  if (!autorDB) {
    return '';
  }
  const family = ucfirst(autorDB.family || '');
  let full = '';

  if (autorDB.first && autorDB.second) {
    full =
      family +
      ' ' +
      autorDB.first.charAt(0).toUpperCase() +
      '. ' +
      autorDB.second.charAt(0).toUpperCase() +
      '.';
  }
  if (autorDB.first && !autorDB.second) {
    full = family + ' ' + autorDB.first.charAt(0).toUpperCase() + '.';
  }
  if (!autorDB.first && !autorDB.second) {
    full = family;
  }

  return full;
}

function extractAuthorsList(doc: WithId<Document>): string[] {
  const loops = (doc.loops || []) as { columns: string[]; data: (string | string[])[] }[];
  const theLoops = loops.filter((item) => {
    return (item.columns || []).indexOf('_publ_author_name') !== -1;
  });
  if (theLoops.length !== 1) {
    return [];
  }
  const colIdx = theLoops[0].columns.indexOf('_publ_author_name');

  return (theLoops[0].data || []).map((row: string | string[]) => {
    if (Array.isArray(row)) {
      return row[colIdx];
    }
    return row;
  });
}

function ucfirst(str: string): string {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.substr(1, str.length - 1);
}
