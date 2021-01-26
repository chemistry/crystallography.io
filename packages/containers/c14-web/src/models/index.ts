import { Dexie } from 'dexie';

let db = null;
const initializeCacheStorage = async () => {

    db = new Dexie("data");
    db.version(1).stores({
        collections: "++name,updated,meta",
        catalog: "++id,structures"
    });
    await db.open();
}

