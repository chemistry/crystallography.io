// One-shot backfill: populates the `fingerprints` collection from `fragments`.
//
// Why: searchrouter pre-filters substructure searches via packed fingerprints
// loaded from `db.collection('fingerprints')` at startup. No service ever
// populated it, so every search short-circuited to 0 results. This script
// derives the fingerprints from the existing `fragments` docs.
//
// Resumable: paginates by `_id` greater-than, so it can be re-run after
// interruption and will pick up from the highest `_id` already present in
// `fingerprints`.
//
// Run as an isolated swarm service (avoids straining searchrouter/mongo):
//   docker service create --name backfill-fp --network crystallography-io_net \
//     --restart-condition none --no-healthcheck --limit-memory 1g \
//     --mount type=bind,source=/tmp/backfill-fingerprints.mjs,target=/app/backfill-fingerprints.mjs,readonly=true \
//     --env MONGO_URI=mongodb://... --entrypoint node \
//     ghcr.io/chemistry/searchrouter:latest /app/backfill-fingerprints.mjs

import { MongoClient } from 'mongodb';
import pkg from '@chemistry/molecule';
const { Molecule } = pkg;

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI env var is required');
  process.exit(1);
}
const BATCH_SIZE = Number(process.env.BATCH_SIZE) || 200;
const SLEEP_MS = Number(process.env.SLEEP_MS) || 100;
const PER_FRAGMENT_TIMEOUT_MS = Number(process.env.PER_FRAGMENT_TIMEOUT_MS) || 10000;
// @chemistry/molecule's fingerprint algorithm is ~quadratic; fragments with
// hundreds of atoms hang the process in WASM (no JS timeout possible). The
// substructure search UI targets organic molecules (molpad editor), so
// skipping huge inorganic fragments is safe.
const MAX_ATOMS_PER_FRAGMENT = Number(process.env.MAX_ATOMS_PER_FRAGMENT) || 100;
const VERBOSE = process.env.VERBOSE === '1';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const client = new MongoClient(uri, {
  maxPoolSize: 2,
  serverSelectionTimeoutMS: 30000,
});

async function main() {
  await client.connect();
  const db = client.db();
  const fragmentsCol = db.collection('fragments');
  const fingerprintsCol = db.collection('fingerprints');

  const total = await fragmentsCol.estimatedDocumentCount();
  const existing = await fingerprintsCol.countDocuments({});
  console.log(`fragments total: ${total}, fingerprints existing: ${existing}`);

  // Resume from highest _id already processed.
  const last = await fingerprintsCol.find({}, { projection: { _id: 1 } }).sort({ _id: -1 }).limit(1).toArray();
  let lastId = last.length > 0 ? last[0]._id : -Infinity;
  console.log(`resume from _id > ${lastId}`);

  const started = Date.now();
  let processed = 0;
  let written = 0;
  let skipped = 0;
  let errors = 0;

  while (true) {
    const query = lastId === -Infinity ? {} : { _id: { $gt: lastId } };
    const docs = await fragmentsCol
      .find(query, { projection: { _id: 1, fragments: 1 } })
      .sort({ _id: 1 })
      .limit(BATCH_SIZE)
      .toArray();
    if (docs.length === 0) break;

    const ops = [];
    for (const doc of docs) {
      processed++;
      lastId = doc._id;
      if (VERBOSE) {
        process.stdout.write(`[${doc._id}] n=${(doc.fragments || []).length} `);
      }
      if (!Array.isArray(doc.fragments) || doc.fragments.length === 0) {
        if (VERBOSE) process.stdout.write('skip\n');
        skipped++;
        continue;
      }
      const fps = [];
      const docStart = Date.now();
      let tooLarge = 0;
      for (const jmol of doc.fragments) {
        const atomCount = Array.isArray(jmol?.atoms) ? jmol.atoms.length : 0;
        if (atomCount > MAX_ATOMS_PER_FRAGMENT) {
          tooLarge++;
          continue;
        }
        let m;
        try {
          m = new Molecule();
          m.load(jmol);
          fps.push(m.getFingerPrintsPacked());
        } catch (err) {
          errors++;
        } finally {
          // Critical: @chemistry/molecule is WASM-backed, native memory
          // leaks if not explicitly destroyed.
          try {
            m?.destroy?.();
          } catch {
            /* noop */
          }
        }
        if (Date.now() - docStart > PER_FRAGMENT_TIMEOUT_MS) {
          console.error(
            `\nTIMEOUT on _id=${doc._id}, aborted after ${fps.length}/${doc.fragments.length} fragments`
          );
          errors++;
          break;
        }
      }
      if (VERBOSE) {
        process.stdout.write(
          `ok ${Date.now() - docStart}ms fps=${fps.length} big=${tooLarge}\n`
        );
      }
      if (fps.length === 0) {
        skipped++;
        continue;
      }
      ops.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { _id: doc._id, fingerprints: fps } },
          upsert: true,
        },
      });
    }

    if (ops.length > 0) {
      await fingerprintsCol.bulkWrite(ops, { ordered: false });
      written += ops.length;
    }

    const elapsed = (Date.now() - started) / 1000;
    const rate = processed / elapsed;
    const remaining = total - existing - processed;
    const eta = rate > 0 ? Math.max(0, remaining / rate) : 0;
    console.log(
      `progress: +${processed} done, lastId=${lastId}, written=${written}, skipped=${skipped}, errors=${errors}, ${rate.toFixed(0)}/s, eta ${eta.toFixed(0)}s`
    );

    if (SLEEP_MS > 0) await sleep(SLEEP_MS);
  }

  const finalCount = await fingerprintsCol.countDocuments({});
  console.log(
    `DONE: processed ${processed}, written ${written}, skipped ${skipped}, errors ${errors}, fingerprints now has ${finalCount} docs`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.close());
