import pkg from '@chemistry/molecule';
const { Molecule } = pkg;
import type { IFingerprintModel } from '../models/index.js';

export function prepareChunksForSearch(
  searchQuery: object,
  fingerPrints: IFingerprintModel[]
): number[][] {
  const fragmentsIdsList: number[] = [];
  const molecule = new Molecule();
  molecule.load(searchQuery);
  const qfp = molecule.getFingerPrintsPacked();

  fingerPrints.forEach((fpm: IFingerprintModel) => {
    let found = false;
    fpm.fingerprints.forEach((fp) => {
      if (found) {
        return;
      }
      for (let i = 0; i < fp.length; i++) {
        if ((fp[i] & qfp[i]) !== qfp[i]) {
          return;
        }
      }
      found = true;
      fragmentsIdsList.push(fpm._id);
    });
  });

  const chunksCount = Math.ceil(fragmentsIdsList.length / 1000);
  const resChunks: number[][] = [];

  for (let i = 0; i < chunksCount; i++) {
    const chunk = fragmentsIdsList.slice(i * 1000, (i + 1) * 1000);
    resChunks.push(chunk);
  }

  return resChunks;
}
