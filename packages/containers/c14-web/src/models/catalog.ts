import { getDB, isNode } from "./utils";

interface CatalogContentResponse {
    meta: { pages: number }
    structures: number[]
}

interface CatalogResponse {
    meta: { pages: number }
    data: [{
        id: number;
        type: string;
        attributes: {
            id: number;
            structures: number[];
        }
    }]
}

const EXPIRE_DAYS = 3;

const getExpireDate = () => {
    return Date.now() + (1000 * 60 * 60 * 24 *  EXPIRE_DAYS);
}

const getFromCache = async (pageQ: number) => {
    const db = await getDB();

    const [dataItem, metaData] = await Promise.all([
        db.catalogId.get(pageQ),
        db.collectionData.get('catalogId')
    ]);
    // do not await for results
    cleanUpCache();

    if (dataItem && metaData) {
        return {
            structures: dataItem?.attributes.structures || [],
            meta: metaData.meta,
        }
    }
    return null;
}

let isInCleaningState = false;
const cleanUpCache = async () => {
    if (isInCleaningState) {
        return;
    }
    isInCleaningState = true;
    try {
        const db = await getDB();
        const now = Date.now();
        const toDelete = await db.catalogId
                .where('expire')
                .below(now)
                .primaryKeys();
        if (toDelete && Array.isArray(toDelete) && toDelete.length > 0) {
            await db.catalogId.bulkDelete(toDelete);
        }
    } catch (e) {
        // tslint:disable-next-line
        console.error(e);
    }
    isInCleaningState = false;
}

const getFromNetwork = async (pageQ: number) => {
    const response = await fetch(
        `https://crystallography.io/api/v1/catalog/?page=${Math.ceil(
            pageQ / 100
        )}`,
        {
            method: "GET",
        }
    );
    const { data, meta } = (await response.json()) as CatalogResponse;
    await storeToCache({ data, meta });

    let structures: number[] = [];
    if (Array.isArray(data)) {
        const dataItem = data.find(
            (el: { id: number }) => el.id === pageQ
        );
        structures = dataItem?.attributes.structures || []
    }
    return {
        meta,
        structures
    }
}

const storeToCache = async ({ data, meta }: CatalogResponse) => {
    if (isNode) {
        return;
    }
    const db = await getDB();
    if (Array.isArray(data) && meta) {
        const newData = data.map(
            (item) => ({ expire:  getExpireDate(), ...item })
        );
        db.catalogId.bulkAdd(newData);
        db.collectionData.put({ id: "catalogId", meta });
    }
}

export const getCatalogContent = async (pageQ: number): Promise<CatalogContentResponse> => {

    if (!isNode) {
        const cachedData = await getFromCache(pageQ);
        if (cachedData) {
            return cachedData;
        }
    }

    return getFromNetwork(pageQ);
};
