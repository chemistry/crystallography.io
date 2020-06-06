import {
    PubSubContext,
} from "@chemistry/common-functions";
import { FieldPath, Firestore, QuerySnapshot } from "@google-cloud/firestore";

const firestore = new Firestore();
const CATALOG_PAGE_SIZE = 100;
const BTACH_SIZE_TO_PROCES = 100 * CATALOG_PAGE_SIZE; // 10 000

const processStructureBatch = async ({ startAfter, page }: {
    startAfter: string,
    page: number,
}) => {

    let querySnapshot: QuerySnapshot;
    if (!startAfter || page === 1) {
        querySnapshot = await firestore
            .collection("structures")
            .limit(BTACH_SIZE_TO_PROCES)
            .orderBy(FieldPath.documentId())
            .select()
            .get();
    } else {
        querySnapshot = await firestore
            .collection("structures")
            .limit(BTACH_SIZE_TO_PROCES)
            .orderBy(FieldPath.documentId())
            .startAfter(startAfter)
            .select()
            .get();
    }

    const ids = querySnapshot.docs.map((doc) => doc.id);
    if (ids.length === 0) {
        return null;
    }

    const pageShift = (page - 1) * Math.ceil(BTACH_SIZE_TO_PROCES / CATALOG_PAGE_SIZE);

    // Save Structure Catalog
    const structureCatalogDocs = [];
    for (let i = 0; i < Math.ceil(ids.length / CATALOG_PAGE_SIZE); i++) {
        const structures = ids.slice(i * CATALOG_PAGE_SIZE, (i + 1) * CATALOG_PAGE_SIZE);
        const sfDocRef = firestore.collection("catalog").doc(`${i + pageShift + 1}`);
        sfDocRef.set({
            structures,
        });
    }

    return {
        startAfter: ids[ids.length - 1],
        page: (page + 1),
    };
};

export async function handler(
    event: any,
    context: PubSubContext,
) {

    // tslint:disable-next-line
    console.time("process");
    let res = { page: 1, startAfter: "" };
    do {
        res = await processStructureBatch(res);
        await new Promise((r) => setTimeout(r, 1000));
        if (res) {
            // tslint:disable-next-line
            console.log(`page: ${res.page - 1} processed; start after: ${res.startAfter}`);
        } else {
            // tslint:disable-next-line
            console.log("Processing finished");
        }

    } while (res);
    // tslint:disable-next-line
    console.timeEnd("process");
}
