import { Molecule } from "@chemistry/molecule";
import {
    IFingerprintModel,
} from "../models";

export function prepareChunksForSearch(searchQuery: object, fingerPrints: IFingerprintModel[]): number[][] {
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
                /* tslint:disable no-bitwise */
                if ((fp[i] & qfp[i]) !== qfp[i]) {
                    return;
                }
                /* tslint:enable no-bitwise */
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
