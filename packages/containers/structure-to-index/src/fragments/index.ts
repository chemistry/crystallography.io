import { createRequire } from 'node:module';
import type { Collection, Document, Filter, WithId } from 'mongodb';
import type { AppContext } from '../app.js';

const require = createRequire(import.meta.url);
const { Molecule3D } = require('@chemistry/molecule3d');

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
  const structuresDB = db.collection('structures');

  const doc = await structuresDB.findOne({ _id: structureId } as unknown as Filter<Document>);
  if (!doc) {
    return;
  }

  await fragmentsUpdate(fragmentsDB, doc);
};

async function fragmentsUpdate(fragmentsDB: Collection, doc: WithId<Document>) {
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

    const fdoc = {
      _id: doc._id,
      fragments: molecule.export(),
    };
    molecule.destroy();

    await fragmentsDB.updateOne(
      {
        _id: fdoc._id,
      },
      {
        $set: {
          _id: fdoc._id,
          fragments: fdoc.fragments,
        },
      },
      {
        upsert: true,
      }
    );
  } catch (e) {
    console.log(e);
  }
}
