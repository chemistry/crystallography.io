import { getDB, isNode } from "./utils";

interface AuthorsContentResponse {
    meta: { pages: number; total: number };
    data: [
        {
            id: number;
            type: string;
            attributes: {
                count: number;
                full: string;
                updated: string;
            };
        }
    ];
}

const EXPIRE_DAYS = 3;
const getExpireDate = () => {
    return Date.now() + 1000 * 20;/* 60 * 60 * 24 * EXPIRE_DAYS; */
};

let isInCleaningState = false;
const cleanUpCache = async () => {
    if (isInCleaningState) {
        return;
    }
    isInCleaningState = true;
    try {
        const db = await getDB();
        const now = Date.now();
        const toDelete = await db.authors
                .where('expire')
                .below(now)
                .primaryKeys();
        if (toDelete && Array.isArray(toDelete) && toDelete.length > 0) {
            await db.authors.bulkDelete(toDelete);
        }
    } catch (e) {
        // tslint:disable-next-line
        console.error(e);
    }
    isInCleaningState = false;
}

const ITEMS_PER_PAGE = 300;
const getIdsForPage = (pageQ: number): number[] => {
    return new Array(ITEMS_PER_PAGE).fill(null).map((_, index) => {
        return index + pageQ * ITEMS_PER_PAGE;
    });
};

const getFromCache = async (pageQ: number): Promise<any> => {
    const db = await getDB();
    const ids = getIdsForPage(pageQ);

    const [data, metaData] = await Promise.all([
        db.authors.bulkGet(ids),
        db.collectionData.get("authorsId"),
    ]);

    const newData = data && data.filter((id) => !!id);

    if (
        Array.isArray(newData) &&
        newData.length > 0 &&
        metaData &&
        metaData.meta
    ) {
        return {
            meta: metaData.meta,
            data: newData,
        };
    }
    return null;
};

const storeToCache = async (
    { data, meta }: AuthorsContentResponse,
    pageQ: number
) => {
    if (isNode) {
        return;
    }
    const db = await getDB();
    if (Array.isArray(data) && meta) {
        const newData = data.map((item, index) => ({
            expire: getExpireDate(),
            ...item,
            id: index + pageQ * ITEMS_PER_PAGE,
        }));
        db.authors.bulkPut(newData);
        db.collectionData.put({ id: "authorsId", meta });
    }
};

const getFromNetwork = async (pageQ: number) => {
    const response = await fetch(
        `https://crystallography.io/api/v1/authors?page=${pageQ}`,
        {
            method: "GET",
        }
    );
    const data = await response.json();
    storeToCache(data, pageQ);
    return data;
};

export const getAuthorsList = async (
    pageQ: number
): Promise<AuthorsContentResponse> => {
    if (!isNode) {
        const cachedData = await getFromCache(pageQ);
        if (cachedData) {
            return cachedData;
        }
    }

    const data = await getFromNetwork(pageQ);

    return data;
};
