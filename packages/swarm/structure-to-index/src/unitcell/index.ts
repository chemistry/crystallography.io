import { Collection } from "mongodb";
import { AppContext } from "../app";

export const processUnitCellIndex = async ({ structureId, context }: { structureId: number, context: AppContext}) => {
    const { log, db } = context;

    const structureDB = db.collection("structures");
    const doc = await structureDB.findOne({ _id: structureId })

    if (!doc) {
        return;
    }

    await addUnitCellInformation(structureDB, doc);
    await ensureUnitCellDBIndexes(structureDB);
}

async function addUnitCellInformation(structureDB: Collection, doc: any) {
    const docId = doc._id;
    const a = parseFloat(doc.a);
    const b = parseFloat(doc.b);
    const c = parseFloat(doc.c);
    const alpha = parseFloat(doc.alpha);
    const beta = parseFloat(doc.beta);
    const gamma = parseFloat(doc.gamma);

    await structureDB.updateOne({
        _id: docId,
    }, {
        $set: {
            __a: a,
            __b: b,
            __c: c,
            __alpha: alpha,
            __beta: beta,
            __gamma: gamma
        },
    });
}

async function ensureUnitCellDBIndexes(structureDB: Collection) {
    await structureDB.createIndex({ __a: 1});
    await structureDB.createIndex({ __b: 1});
    await structureDB.createIndex({ __c: 1});
    await structureDB.createIndex({ __alpha: 1});
    await structureDB.createIndex({ __beta: 1});
    await structureDB.createIndex({ __gamma: 1});
}
