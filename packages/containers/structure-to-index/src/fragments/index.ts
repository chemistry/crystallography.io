import { createRequire } from 'node:module';
import type { Collection, Db, Document, Filter, WithId } from 'mongodb';
import type { AppContext } from '../app.js';
import pkg from '@chemistry/molecule';
const { Molecule } = pkg;

const require = createRequire(import.meta.url);
const { Molecule3D } = require('@chemistry/molecule3d/dist/molecule3d.js');

const BLACK_LIST = [2003119, 2000129, 2105953, 4323098, 4323099];

export const processFragments = async ({
  structureId,
  context,
}: {
  structureId: number;
  context: AppContext;
}) => {
  const { logger, db } = context;

  if (BLACK_LIST.includes(Number(structureId))) {
    logger.info(`Ignoring file ${structureId} as it listed in black list`);
    return;
  }

  const fragmentsDB = db.collection('fragments');
  const fingerprintsDB = db.collection('fingerprints');
  const structuresDB = db.collection('structures');

  const doc = await structuresDB.findOne({ _id: structureId } as unknown as Filter<Document>);
  if (!doc) {
    return;
  }

  await fragmentsUpdate(db, fragmentsDB, fingerprintsDB, doc);
};

async function fragmentsUpdate(
  _db: Db,
  fragmentsDB: Collection,
  fingerprintsDB: Collection,
  doc: WithId<Document>
) {
  try {
    const molecule = new Molecule3D();

    molecule.load(doc);

    const atomCount = molecule.getAtomsCount();

    if (molecule.isOrganic()) {
      molecule.addAtomLayers(15, Math.max(atomCount, 30) * 3);
    } else {
      // Do not extend inorganic molecules
      // molecule.addAtomLayers(1, Math.max(atomCount, 10) * 3);
    }

    const fragments = molecule.export();
    const fdoc = {
      _id: doc._id,
      fragments,
    };
    molecule.destroy();

    // Compute packed fingerprints for the substructure-search pre-filter.
    // Without this, searchrouter's `fingerprints` collection stays empty and
    // every substructure search short-circuits to 0 results.
    const packedFingerprints: number[][] = [];
    for (const jmol of fragments) {
      try {
        const m = new Molecule();
        m.load(jmol);
        packedFingerprints.push(m.getFingerPrintsPacked());
      } catch (err) {
        console.error(err);
      }
    }

    await fragmentsDB.updateOne(
      { _id: fdoc._id },
      { $set: { _id: fdoc._id, fragments: fdoc.fragments } },
      { upsert: true }
    );

    if (packedFingerprints.length > 0) {
      await fingerprintsDB.updateOne(
        { _id: fdoc._id },
        { $set: { _id: fdoc._id, fingerprints: packedFingerprints } },
        { upsert: true }
      );
    }
  } catch (e) {
    console.log(e);
  }
}
