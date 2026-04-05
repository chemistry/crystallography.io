// One-shot backfill: populates the `fingerprints` collection from `fragments`.
//
// Why: searchrouter pre-filters substructure searches via packed fingerprints
// loaded from `db.collection('fingerprints')` at startup. No service ever
// populated it, so every search short-circuited to 0 results. This script
// derives the fingerprints from the existing `fragments` docs.
//
// Run inside the searchrouter container (it has @chemistry/molecule + mongodb):
//   docker exec -i <searchrouter> node < scripts/backfill-fingerprints.mjs
//
// Env: MONGO_URI (required), BATCH_SIZE (optional, default 500)

import { MongoClient } from 'mongodb';
import pkg from '@chemistry/molecule';
const { Molecule } = pkg;

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI env var is required');
  process.exit(1);
}
const BATCH_SIZE = Number(process.env.BATCH_SIZE) || 500;

const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const db = client.db();
  const fragmentsCol = db.collection('fragments');
  const fingerprintsCol = db.collection('fingerprints');

  const total = await fragmentsCol.estimatedDocumentCount();
  console.log(`fragments total: ${total}`);

  const existing = await fingerprintsCol.estimatedDocumentCount();
  console.log(`fingerprints existing: ${existing}`);

  const cursor = fragmentsCol.find({}, { projection: { _id: 1, fragments: 1 } });
  let processed = 0;
  let written = 0;
  let skipped = 0;
  let errors = 0;
  let batch = [];
  const started = Date.now();

  for await (const doc of cursor) {
    processed++;
    if (!Array.isArray(doc.fragments) || doc.fragments.length === 0) {
      skipped++;
    } else {
      const fps = [];
      for (const jmol of doc.fragments) {
        try {
          const m = new Molecule();
          m.load(jmol);
          fps.push(m.getFingerPrintsPacked());
        } catch (err) {
          errors++;
          console.error(`fragment ${doc._id}: ${err.message || err}`);
        }
      }
      if (fps.length > 0) {
        batch.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { _id: doc._id, fingerprints: fps } },
            upsert: true,
          },
        });
      } else {
        skipped++;
      }
    }

    if (batch.length >= BATCH_SIZE) {
      await fingerprintsCol.bulkWrite(batch, { ordered: false });
      written += batch.length;
      batch = [];
      const elapsed = (Date.now() - started) / 1000;
      const rate = processed / elapsed;
      const eta = total > processed ? (total - processed) / rate : 0;
      console.log(
        `progress: ${processed}/${total} | written: ${written} | skipped: ${skipped} | errors: ${errors} | ${rate.toFixed(0)}/s | eta ${eta.toFixed(0)}s`
      );
    }
  }

  if (batch.length > 0) {
    await fingerprintsCol.bulkWrite(batch, { ordered: false });
    written += batch.length;
  }

  const finalCount = await fingerprintsCol.estimatedDocumentCount();
  console.log(
    `DONE: processed ${processed}, written ${written}, skipped ${skipped}, errors ${errors}, fingerprints collection now has ${finalCount} docs`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
