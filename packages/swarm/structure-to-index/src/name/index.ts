import { Collection } from "mongodb";
import { AppContext } from "../app";
import { prepareWords, WordsRecord } from "./helper";


export const processNamesIndex = async ({ structureId, context }: { structureId: number, context: AppContext}) => {
    const { log, db } = context;

    const namesDB = db.collection("names");
    await ensureStructureNamesIndexes(namesDB);

    const structuresDB  = db.collection("structures")

    const doc = await structuresDB.findOne({ _id: structureId })
    if (!doc) {
        return;
    }
    await clearDocLinks(namesDB, doc._id);

    if (!doc.mineral && !doc.commonname && !doc.chemname) {
        return;
    }

    await processNames(namesDB, doc);
}

async function processNames(namesDB: Collection, doc: any) {
    const wordsRows: WordsRecord[] = [];
    if (doc.mineral) {
        wordsRows.push(prepareWords(doc.mineral));
    }
    if (doc.commonname) {
        wordsRows.push(prepareWords(doc.commonname));
    }
    if (doc.chemname) {
        wordsRows.push(prepareWords(doc.chemname));
    }

    if (wordsRows.length) {
        for (const wordsRow of wordsRows) {
            // process words row
            await processWordRow(namesDB, wordsRow,  doc._id);
        }
    }
}

async function processWordRow(namesDB: Collection, wRow: WordsRecord, docId: string) {
    if (!wRow.firstword || !wRow.name) {
        return;
    }
    const record = await findNameByRow(namesDB, wRow);
    if (record) {
        await updateName(namesDB, record, docId);
    } else {
        await addNewName(namesDB, wRow, docId) ;
    }
}

async function addNewName(namesDB: Collection, wRow: WordsRecord, docId: string) {
    let row: any = {
        words: [],
    };
    const firstword = wRow.firstword.toUpperCase();

    row = {
        ...row,
        words: wRow.words.slice(0) || [],
        name: wRow.name,
        a: firstword.charAt(0),
    };

    if (firstword.length > 1) {
        row = {
            ...row,
            ab: firstword.substr(0, 2),
        };
    }
    if (firstword.length > 2) {
        row = {
            ...row,
            abc: firstword.substr(0, 3),
        };
    }
    if (firstword.length > 3) {
        row = {
            ...row,
            abcd: firstword.substr(0, 4),
        };
    }
    if (firstword.length > 4) {
        row = {
            ...row,
            abcde: firstword.substr(0, 5),
        };
    }
    row = {
        ...row,
        wa: [],
        wab: [],
        wabc: [],
        wabcd: [],
        wabcde: [],
    };

    row.words.forEach((word: string) => {
      let s;
      const w = word.toUpperCase();

      if (w.length) {
          s = w.substr(0, 1);
          if (row.wa.indexOf(s) === -1) {
              row.wa.push(s);
          }
      }
      if (w.length > 1) {
          s = w.substr(0, 2);
          if (row.wab.indexOf(s) === -1) {
              row.wab.push(s);
          }
      }
      if (firstword.length > 2) {
          s = w.substr(0, 3);
          if (row.wabc.indexOf(s) === -1) {
              row.wabc.push(s);
          }
      }
      if (firstword.length > 3) {
          s = w.substr(0, 4);
          if (row.wabcd.indexOf(s) === -1) {
              row.wabcd.push(s);
          }
      }
      if (firstword.length > 4) {
          s = w.substr(0, 5);
          if (row.wabcde.indexOf(s) === -1) {
              row.wabcde.push(s);
          }
      }
  });

    await namesDB.insertOne({
      ...row,
      count: 1,
      structures: [docId],
  });
}

async function updateName(namesDB: Collection, record: any, docId: string) {
    if (record.structures.indexOf(docId) === -1) {
        const newStructures = record.structures.slice(0);
        newStructures.push(docId);
        await namesDB.updateOne({
              _id: record._id,
        }, {
              $set: {
                structures: newStructures.slice(0),
                count : newStructures.length,
              },
        });
    }
}

async function findNameByRow(namesDB: Collection, wRow: any) {
    const firstword = wRow.firstword.toUpperCase();
    const where: any = {
        name: wRow.name,
    };

    if (firstword.length === 1) {
        where.a = firstword.substr(0, 1);
    }
    if (firstword.length === 2) {
        where.ab = firstword.substr(0, 2);
    }
    if (firstword.length === 3) {
        where.abc = firstword.substr(0, 3);
    }
    if (firstword.length === 4) {
        where.abcd = firstword.substr(0, 4);
    }
    if (firstword.length > 4) {
        where.abcde = firstword.substr(0, 5);
    }
    return await namesDB.findOne(where);
}

async function clearDocLinks(namesDB: Collection, docId: number) {

    const recordsList = await namesDB.find({
        structures: docId
    }).toArray();

    const promises = recordsList.map(async (record) => {
        const index = record.structures.indexOf(docId);
        record.structures.splice(index, 1);

        const structuresCount = record.structures.length;
        if (structuresCount === 0) {
            await namesDB.deleteOne({
                _id: record._id,
            })
        } else {
            record.count = structuresCount;
            await namesDB.updateOne({
                    _id: record._id,
            }, {
                    $set: {
                    structures: record.structures.slice(0),
                    count : structuresCount,
                    },
            });
        }
    });

    await Promise.all(promises);
}

async function ensureStructureNamesIndexes(namesDB: Collection) {
    await namesDB.createIndex({ wa: 1, count: -1 }, {});
    await namesDB.createIndex({ wab: 1, count: -1 }, {});
    await namesDB.createIndex({ wabc: 1, count: -1 }, {});
    await namesDB.createIndex({ wabcd: 1, count: -1 }, {});
    await namesDB.createIndex({ wabcde: 1, count: -1 }, {});
    await namesDB.createIndex({ a: 1, count: -1 }, {});
    await namesDB.createIndex({ ab: 1, count: -1 }, {});
    await namesDB.createIndex({ abc: 1, count: -1 }, {});
    await namesDB.createIndex({ abcd: 1, count: -1 }, {});
    await namesDB.createIndex({ abcde: 1, count: -1 }, {});
    await namesDB.createIndex({ abcd: 1, name: 1 }, {});
    await namesDB.createIndex({ abcde: 1, name: 1 }, {});
    await namesDB.createIndex({ structures: 1 }, {});
}
