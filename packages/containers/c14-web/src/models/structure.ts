import { getDB, isNode } from "./utils";

const MAX_ITEMS_TO_STORE = 1000;
const SCALE_FACTOR = 2;

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

const cleanUpCache = async ()=> {
    const db = await getDB();
    const count = await db.structures.count();
    if (count > MAX_ITEMS_TO_STORE * SCALE_FACTOR) {
        const itemsCountToDelete = count - MAX_ITEMS_TO_STORE;

        // DB structures -----
        const itemsToDelete = await db.structures
            .orderBy('accessed')
            .reverse()
            .offset(0)
            .limit(itemsCountToDelete)
            .toArray();
    }
}

const getStructuresCached = async (ids: number[]) => {
    const db = await getDB();
    const data = (await db.structures.bulkGet(ids)).filter((id) => !!id);
    // store accessed time
    const newData = data.map(
        (item) => ({ accessed: Date.now(), ...item })
    );
    // do not await to complete
    db.structures.bulkPut(newData);
    return data;
};

const storeDataToCache = async (data: any[]) => {
    const db = await getDB();
    const newData = data.map(
        (item) => ({ accessed: Date.now(), ...item })
    );
    await db.structures.bulkAdd(newData);
    // await cleanUpCache();
    return;
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
