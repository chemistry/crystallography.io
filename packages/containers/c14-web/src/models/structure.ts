import { getDB, isNode } from "./utils";


const getStructuresData = async (ids: number[]) => {
    const response = await fetch(
        `https://crystallography.io/api/v1/structure`,
        {
            method: "POST",
            body: `ids=[${ids.join(",")}]`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    const res = await response.json();
    return res.data;
};

const EXPIRE_DAYS = 3;

let isInCleaningState = false;
const cleanUpCache = async () => {
    if (isInCleaningState) {
        return;
    }
    isInCleaningState = true;
    try {
        const db = await getDB();
        const count = await db.structures.count();
        const now = Date.now();
        const toDelete = await db.structures
                .where('expire')
                .below(now)
                .primaryKeys();
        if (toDelete && Array.isArray(toDelete) && toDelete.length > 0) {
            await db.structures.bulkDelete(toDelete);
        }
    } catch (e) {
        // tslint:disable-next-line
        console.error(e);
    }
    isInCleaningState = false;
}

const getExpireDate = () => {
    return Date.now() + (1000 * 60 * 60 * 24 *  EXPIRE_DAYS);
}

const getStructuresCached = async (ids: number[]) => {
    const db = await getDB();
    const data = (await db.structures.bulkGet(ids));
    // asynchronously clean up
    cleanUpCache();
    return data.filter((id) => !!id);
};

const storeDataToCache = async (data: any[]) => {
    const db = await getDB();
    const newData = data.map(
        (item) => ({ expire:  getExpireDate(), ...item })
    );
    return await db.structures.bulkAdd(newData);
};

const difference = (arr1: any[], arr2: any[]) => {
    return arr1.filter((x) => !arr2.includes(x));
};

export const getStructures = async (ids: number[]) => {
    if (ids.length === 0) {
        return { data: [] };
    }
    if (isNode) {
        return await getStructuresData(ids);
    }
    const cachedData = await getStructuresCached(ids);
    const idsToLoad = difference(
        ids,
        cachedData.map(({ id }) => id)
    );
    let dataFromServer = [];

    if (idsToLoad.length > 0) {
        dataFromServer = await getStructuresData(ids);
        await storeDataToCache(dataFromServer);
    }

    return {
        data: [...cachedData, ...dataFromServer],
    };
};
